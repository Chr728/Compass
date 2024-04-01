require("dotenv").config();
import { Logger } from "../middlewares/logger";
import db from "../models";
import moment = require("moment-timezone");
const webPush = require("web-push");
const fs = require("fs");
const csv = require("csv-parser");

export const sendMoodReminder = async () => {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  // Set vapid keys
  webPush.setVapidDetails("mailto:test@gmail.com", publicKey, privateKey);

  try {
    //Get current Date and current Time
    const currentDate = moment.tz("America/Toronto").format("YYYY-MM-DD");
    const currentTime = moment.tz("America/Toronto").format("HH:mm:00");

    const moodJournalStartTime = moment(currentTime, "HH:mm:ss");
    const moodJournalEndTime = moodJournalStartTime
      .clone()
      .subtract(30, "minutes");

    //Get all mood journal entries that correspond to current Date and 30 minutes before the current time
    const moodJournals = await db.MoodJournal.findAll({
      where: {
        date: currentDate,
        time: {
          [db.Sequelize.Op.lte]: moodJournalStartTime.format("HH:mm:00"),
          [db.Sequelize.Op.gte]: moodJournalEndTime.format("HH:mm:00"),
        },
      },
      order: [
        ["date", "DESC"],
        ["time", "DESC"],
        ["uid", "ASC"],
      ],
    });

    let sentAlready: string | any[] = [];

    if (moodJournals.length > 0) {
      for (const moodJournal of moodJournals) {
        // Retrieve notification preference first.
        const userNotificationPreferences =
          await db.NotificationPreference.findOne({
            where: {
              uid: moodJournal.uid,
            },
          });

        // Continue if there's an error
        if (!userNotificationPreferences) {
          Logger.error(`Notification preference not found, invalid user id.`);
          continue;
        }

        //Get subscription of users
        if (userNotificationPreferences.moodReminders) {
          const userSubscription = await db.Subscription.findOne({
            where: {
              uid: moodJournal.uid,
            },
          });

          if (!userSubscription) {
            Logger.error(`No Subscription was found.`);
            continue;
          }

          //Send the reminder if they are feeling meh, bad or awful. Send their latest mood journal entry
          if (
            (moodJournal.howAreYou == "sad" ||
              moodJournal.howAreYou == "bad" ||
              moodJournal.howAreYou == "awful") &&
            !sentAlready.includes(moodJournal.uid)
          ) {
            //find exisitng entry
            const healthTipEntry = await db.HealthTips.findOne({
              where: {
                uid: moodJournal.uid,
              },
            });

            //Clear content of existing entry if does not exist or create a new one
            if (healthTipEntry) {
              await db.HealthTips.update(
                {
                  angertips: "",
                  anxietytips: "",
                  depressiontips: "",
                  overwhelmedtips: "",
                  sleeptips: "",
                  tiredtips: "",
                  attentiontips: "",
                },
                {
                  where: {
                    uid: moodJournal.uid,
                  },
                }
              );
            } else {
              await db.HealthTips.create({
                uid: moodJournal.uid,
              });
            }

            //Fetch sleep tips
            const results: string | any[] = [
              "Be consistent. Go to bed at the same time each night and get up at the same time each morning, including on the weekends",
              "Make sure your bedroom is quiet, dark, relaxing, and at a comfortable temperature",
              "Remove electronic devices, such as TVs, computers, and smart phones, from the bedroom",
              "Avoid large meals, caffeine, and alcohol before bedtime",
              "Get some exercise. Being physically active during the day can help you fall asleep more easily at night.",
              "Establish a relaxing bedtime routine.",
              "If you don’t fall asleep after 20 minutes, get out of bed. Go do a quiet activity without a lot of light exposure. It is especially important to not get on electronics.",
              "Set a bedtime that is early enough for you to get at least 7-8 hours of sleep.",
            ];
            const stressSignalsParsed = JSON.parse(moodJournal.stressSignals);
            if (
              stressSignalsParsed.sleep == "always" ||
              stressSignalsParsed.sleep == "often"
            ) {
              let getFirstRandomTip = Math.floor(
                Math.random() * (results.length - 1 - 0 + 1) + 0
              );
              let firstTip = results[getFirstRandomTip];
              let secondTip = false;
              let getSecondRandomTip = 0;
              while (!secondTip) {
                getSecondRandomTip = Math.floor(
                  Math.random() * (results.length - 1 - 0 + 1) + 0
                );
                if (getSecondRandomTip != getFirstRandomTip) {
                  secondTip = true;
                }
              }
              secondTip = results[getSecondRandomTip];
              const JSONsleepTips = {
                tip1: firstTip,
                tip2: secondTip,
              };
              const sleepTips = JSON.stringify(JSONsleepTips);

              if (sleepTips != "") {
                await db.HealthTips.update(
                  {
                    sleeptips: sleepTips,
                    date: moodJournal.date,
                    time: moodJournal.time,
                  },
                  {
                    where: {
                      uid: moodJournal.uid,
                    },
                  }
                );
              }
            }

            //Fetch depression tips
            const depressionResults: string | any[] = [
              "Consider a walk around the block",
              "Set attainable goals",
              "Do something you enjoy",
              "Listen to music",
              "Spend time with loved ones",
              "Express your feelings (Journaling)",
              "Practice gratitude",
              "Incorporate meditation",
            ];
            if (
              stressSignalsParsed.depressed == "always" ||
              stressSignalsParsed.depressed == "often"
            ) {
              let getFirstRandomTip = Math.floor(
                Math.random() * (depressionResults.length - 1 - 0 + 1) + 0
              );
              let firstTip = depressionResults[getFirstRandomTip];
              let secondTip = false;
              let getSecondRandomTip = 0;
              while (!secondTip) {
                getSecondRandomTip = Math.floor(
                  Math.random() * (depressionResults.length - 1 - 0 + 1) + 0
                );
                if (getSecondRandomTip != getFirstRandomTip) {
                  secondTip = true;
                }
              }
              secondTip = depressionResults[getSecondRandomTip];

              const JSONdepressionTips = {
                tip1: firstTip,
                tip2: secondTip,
              };

              const depressionTips = JSON.stringify(JSONdepressionTips);

              if (depressionTips != "") {
                await db.HealthTips.update(
                  {
                    depressiontips: depressionTips,
                    date: moodJournal.date,
                    time: moodJournal.time,
                  },
                  {
                    where: {
                      uid: moodJournal.uid,
                    },
                  }
                );
              }
            }

            //Fetch tired tips
            const tiredResults: string | any[] = [
              "Drink plenty of water",
              "Regularly Eat breakfast",
              "Don't skip meals",
              "Eat a healthy diet (fruit, vegetables, wholegrain foods, low fat dairy products and lean meats)",
              "Eat iron rich foods",
              "Increase physical activity",
              "Aerobic Exercises every week (cycling, fast walking)",
              "Go for frequent 15-minute walks",
            ];
            if (
              stressSignalsParsed.tired == "always" ||
              stressSignalsParsed.tired == "often"
            ) {
              let getFirstRandomTip = Math.floor(
                Math.random() * (tiredResults.length - 1 - 0 + 1) + 0
              );
              let firstTip = tiredResults[getFirstRandomTip];
              let secondTip = false;
              let getSecondRandomTip = 0;
              while (!secondTip) {
                getSecondRandomTip = Math.floor(
                  Math.random() * (tiredResults.length - 1 - 0 + 1) + 0
                );
                if (getSecondRandomTip != getFirstRandomTip) {
                  secondTip = true;
                }
              }
              secondTip = tiredResults[getSecondRandomTip];

              const JSONtiredTips = {
                tip1: firstTip,
                tip2: secondTip,
              };

              const tiredTips = JSON.stringify(JSONtiredTips);

              if (tiredTips != "") {
                await db.HealthTips.update(
                  {
                    tiredtips: tiredTips,
                    date: moodJournal.date,
                    time: moodJournal.time,
                  },
                  {
                    where: {
                      uid: moodJournal.uid,
                    },
                  }
                );
              }
            }

            //Fetch attention tips
            const attentionResults: string | any[] = [
              "Avoid multitasking. Focus on one task at a time",
              "Get enough sleep (atleast 7 hours)",
              "Practice mindfulness (deep breaths, taking a walk)",
              "Take regular short breaks when doing a task",
              "Spend time in nature",
              "Avoid food with high refined sugars and saturated fats",
              "Practice coordinated bilateral exercise",
            ];
            if (
              stressSignalsParsed.attention == "always" ||
              stressSignalsParsed.attention == "often"
            ) {
              let getFirstRandomTip = Math.floor(
                Math.random() * (attentionResults.length - 1 - 0 + 1) + 0
              );
              let firstTip = attentionResults[getFirstRandomTip];
              let secondTip = false;
              let getSecondRandomTip = 0;
              while (!secondTip) {
                getSecondRandomTip = Math.floor(
                  Math.random() * (attentionResults.length - 1 - 0 + 1) + 0
                );
                if (getSecondRandomTip != getFirstRandomTip) {
                  secondTip = true;
                }
              }
              secondTip = attentionResults[getSecondRandomTip];

              const JSONattentionTips = {
                tip1: firstTip,
                tip2: secondTip,
              };

              const attentionTips = JSON.stringify(JSONattentionTips);

              if (attentionTips != "") {
                await db.HealthTips.update(
                  {
                    attentiontips: attentionTips,
                    date: moodJournal.date,
                    time: moodJournal.time,
                  },
                  {
                    where: {
                      uid: moodJournal.uid,
                    },
                  }
                );
              }
            }

            //Fetch anger tips
            const angerResults: string | any[] = [
              "Take a few moments to collect your thoughts before saying anything",
              "Once you're calm, express your concerns",
              "Take some timeout during the day",
              "Use humor to release tension",
              "Pay attention to what triggers your anger. Knowing when you may get angry can help you plan ahead to manage your reaction",
            ];
            if (
              stressSignalsParsed.anger == "always" ||
              stressSignalsParsed.anger == "often"
            ) {
              let getFirstRandomTip = Math.floor(
                Math.random() * (angerResults.length - 1 - 0 + 1) + 0
              );
              let firstTip = angerResults[getFirstRandomTip];
              let secondTip = false;
              let getSecondRandomTip = 0;
              while (!secondTip) {
                getSecondRandomTip = Math.floor(
                  Math.random() * (angerResults.length - 1 - 0 + 1) + 0
                );
                if (getSecondRandomTip != getFirstRandomTip) {
                  secondTip = true;
                }
              }
              secondTip = angerResults[getSecondRandomTip];

              const JSONangerTips = {
                tip1: firstTip,
                tip2: secondTip,
              };

              const angerTips = JSON.stringify(JSONangerTips);

              if (angerTips != "") {
                await db.HealthTips.update(
                  {
                    angertips: angerTips,
                    date: moodJournal.date,
                    time: moodJournal.time,
                  },
                  {
                    where: {
                      uid: moodJournal.uid,
                    },
                  }
                );
              }
            }

            //Fetch anxiety tips
            const anxietyResults: string | any[] = [
              "Slow breathing (Count to three as you breathe in slowly. Count to three as you breathe out slowly)",
              "Progressive muscle relaxation (Find a quiet location. Close your eyes and slowly tense and then relax each of your muscle groups from your toes to your head. Hold the tension for three seconds and then release quickly.)",
              "Staying active (regular exercise)",
              "Redirect your mind to a positive thought or activity",
              "Hand on Heart Anxiety Reduction Technique : https://www.youtube.com/watch?v=2-WMJpoi8Qo",
            ];
            if (
              stressSignalsParsed.anxiety == "always" ||
              stressSignalsParsed.anxiety == "often"
            ) {
              let getFirstRandomTip = Math.floor(
                Math.random() * (anxietyResults.length - 1 - 0 + 1) + 0
              );
              let firstTip = anxietyResults[getFirstRandomTip];
              let secondTip = false;
              let getSecondRandomTip = 0;
              while (!secondTip) {
                getSecondRandomTip = Math.floor(
                  Math.random() * (anxietyResults.length - 1 - 0 + 1) + 0
                );
                if (getSecondRandomTip != getFirstRandomTip) {
                  secondTip = true;
                }
              }
              secondTip = anxietyResults[getSecondRandomTip];

              const JSONanxietyTips = {
                tip1: firstTip,
                tip2: secondTip,
              };

              const anxietyTips = JSON.stringify(JSONanxietyTips);

              if (anxietyTips != "") {
                await db.HealthTips.update(
                  {
                    anxietytips: anxietyTips,
                    date: moodJournal.date,
                    time: moodJournal.time,
                  },
                  {
                    where: {
                      uid: moodJournal.uid,
                    },
                  }
                );
              }
            }

            //Fetch pressure tips
            const pressureResults: string | any[] = [
              "Ask yourself: What’s causing you to feel stressed right now?",
              "Break tasks into manageable chunks: Instead of viewing everything as one colossal mountain, break tasks or challenges into smaller, more manageable steps.",
              "Prioritize Your Tasks",
              "Do something you enjoy (listening to music, cooking dinner, spending time with loved ones etc)",
              "Take a break from digital devices. Constant notifications can amplify feelings of overwhelm.",
            ];
            if (
              stressSignalsParsed.pressure == "always" ||
              stressSignalsParsed.pressure == "often"
            ) {
              let getFirstRandomTip = Math.floor(
                Math.random() * (pressureResults.length - 1 - 0 + 1) + 0
              );
              let firstTip = pressureResults[getFirstRandomTip];
              let secondTip = false;
              let getSecondRandomTip = 0;
              while (!secondTip) {
                getSecondRandomTip = Math.floor(
                  Math.random() * (pressureResults.length - 1 - 0 + 1) + 0
                );
                if (getSecondRandomTip != getFirstRandomTip) {
                  secondTip = true;
                }
              }
              secondTip = pressureResults[getSecondRandomTip];

              const JSONpressureTips = {
                tip1: firstTip,
                tip2: secondTip,
              };

              const pressureTips = JSON.stringify(JSONpressureTips);

              if (pressureTips != "") {
                await db.HealthTips.update(
                  {
                    overwhelmedtips: pressureTips,
                    date: moodJournal.date,
                    time: moodJournal.time,
                  },
                  {
                    where: {
                      uid: moodJournal.uid,
                    },
                  }
                );
              }
            }

            const payload = JSON.stringify({
              title: `Your latest mood journal entry has been assesed. New tips have arrived!`,
              body: `It appears you have been feeling ${moodJournal.howAreYou} lately. Compass has found new tips for you to make you feel better!`,
            });
            webPush
              .sendNotification(userSubscription.subscription, payload)
              .catch((error: any) => Logger.error(error));
            Logger.info(
              "Notification for moodJournal sent to user: ",
              moodJournal.uid
            );

            sentAlready.push(moodJournal.uid);
          }
        }
      }
      sentAlready = [];
    }
    Logger.info("Mood Journal Reminder sucesfully executed!");
  } catch (err) {
    Logger.error(
      `Error occurred while fetching mood journal reminders for user: ${err}`
    );
  }
};
