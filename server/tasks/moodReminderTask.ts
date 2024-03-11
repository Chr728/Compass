require("dotenv").config();
import { Logger } from "../middlewares/logger";
import db from "../models";
import moment = require("moment-timezone");
const webPush = require("web-push");
const fs = require("fs");
const csv = require("csv-parser")


export const sendMoodReminder = async () => {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  // Set vapid keys
  webPush.setVapidDetails("mailto:test@gmail.com", publicKey, privateKey);

  try{
    
    //Get current Date and current Time
    const currentDate = moment.tz("America/Toronto").format("YYYY-MM-DD");
    const currentTime = moment.tz("America/Toronto").format("HH:mm:00");

    const moodJournalStartTime =  moment(currentTime, "HH:mm:ss");
    const moodJournalEndTime = moodJournalStartTime.clone().subtract(30, 'minutes');


    //Get all mood journal entries that correspond to current Date and 30 minutes before the current time
    const moodJournals = await db.MoodJournal.findAll({
        where:{
            date: currentDate,
            time:{
                [db.Sequelize.Op.lte]: moodJournalStartTime.format("HH:mm:00"),
                [db.Sequelize.Op.gte]: moodJournalEndTime.format("HH:mm:00"),
            },
        },
        order: [
            ['date', 'DESC'],
            ['time', 'DESC'],
            ["uid", "ASC"],
        ],       
    })

    let sentAlready: string | any[] = []

    if (moodJournals.length > 0) {
        for (const moodJournal of moodJournals){
            
            //Get subscription of users
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
            if ((moodJournal.howAreYou == "sad" || moodJournal.howAreYou == "bad" || moodJournal.howAreYou == "awful") && !sentAlready.includes(moodJournal.uid)){
              
              //Fetch sleep tips
              const results: string | any[] = []
              const stressSignalsParsed = JSON.parse(moodJournal.stressSignals)
              if (stressSignalsParsed.sleep == "always" || stressSignalsParsed.sleep == "often"){
                fs.createReadStream('./healthTips/sleepTips.csv')
                .pipe(csv())
                .on('data', (data: string) => results.push(data))
                .on('end', () => {
                  let getFirstRandomTip = Math.floor(Math.random() * ((results.length - 1) - 0 + 1) + 0)
                  let firstTip = results[getFirstRandomTip].TIPS
                  let secondTip = false
                  let getSecondRandomTip = 0
                  while(!secondTip){
                    getSecondRandomTip = Math.floor(Math.random() * ((results.length - 1) - 0 + 1) + 0)
                    if (getSecondRandomTip != getFirstRandomTip){
                      secondTip = true
                    }
                  }
                  secondTip = results[getSecondRandomTip].TIPS

                  const sleepTips = {
                    "tip1":firstTip,
                    "tip2":secondTip,
                  }

                  Logger.info(JSON.stringify(sleepTips))

                });
              }
            
              //Fetch depression tips
              const depressionResults: string | any[] = []
                if (stressSignalsParsed.depressed == "always" || stressSignalsParsed.depressed == "often"){
                  fs.createReadStream('./healthTips/depressionTips.csv')
                  .pipe(csv())
                  .on('data', (data: string) => depressionResults.push(data))
                  .on('end', () => {
                    let getFirstRandomTip = Math.floor(Math.random() * ((depressionResults.length - 1) - 0 + 1) + 0)
                    let firstTip = depressionResults[getFirstRandomTip].TIPS
                    let secondTip = false
                    let getSecondRandomTip = 0
                    while(!secondTip){
                      getSecondRandomTip = Math.floor(Math.random() * ((depressionResults.length - 1) - 0 + 1) + 0)
                      if (getSecondRandomTip != getFirstRandomTip){
                        secondTip = true
                      }
                    }
                    secondTip = depressionResults[getSecondRandomTip].TIPS

                    const depressionTips = {
                      "tip1":firstTip,
                      "tip2":secondTip,
                    }
                    Logger.info(JSON.stringify(depressionTips))
                  });
                }

                //Fetch tired tips
                const tiredResults: string | any[] = []
                if (stressSignalsParsed.tired == "always" || stressSignalsParsed.tired == "often"){
                  fs.createReadStream('./healthTips/tiredTips.csv')
                  .pipe(csv())
                  .on('data', (data: string) => tiredResults.push(data))
                  .on('end', () => {
                    let getFirstRandomTip = Math.floor(Math.random() * ((tiredResults.length - 1) - 0 + 1) + 0)
                    let firstTip = tiredResults[getFirstRandomTip].TIPS
                    let secondTip = false
                    let getSecondRandomTip = 0
                    while(!secondTip){
                      getSecondRandomTip = Math.floor(Math.random() * ((tiredResults.length - 1) - 0 + 1) + 0)
                      if (getSecondRandomTip != getFirstRandomTip){
                        secondTip = true
                      }
                    }
                    secondTip = tiredResults[getSecondRandomTip].TIPS

                    const tiredTips = {
                      "tip1":firstTip,
                      "tip2":secondTip,
                    }
                    Logger.info(JSON.stringify(tiredTips))
                  });
                }

                //Fetch attention tips
                const attentionResults: string | any[] = []
                if(stressSignalsParsed.attention == "always" || stressSignalsParsed.attention == "often"){
                  fs.createReadStream('./healthTips/attentionTips.csv')
                  .pipe(csv())
                  .on('data', (data: string) => attentionResults.push(data))
                  .on('end', () => {
                    let getFirstRandomTip = Math.floor(Math.random() * ((attentionResults.length - 1) - 0 + 1) + 0)
                    let firstTip = attentionResults[getFirstRandomTip].TIPS
                    let secondTip = false
                    let getSecondRandomTip = 0
                    while(!secondTip){
                      getSecondRandomTip = Math.floor(Math.random() * ((attentionResults.length - 1) - 0 + 1) + 0)
                      if (getSecondRandomTip != getFirstRandomTip){
                        secondTip = true
                      }
                    }
                    secondTip = attentionResults[getSecondRandomTip].TIPS

                    const attentionTips = {
                      "tip1":firstTip,
                      "tip2":secondTip,
                    }
                    Logger.info(JSON.stringify(attentionTips))
                  });
                }
              
              
              
              const payload = JSON.stringify({
                    title: `Your latest mood journal entry has been assesed. New tips have arrived!`,
                    body:`It appears you have been feeling ${moodJournal.howAreYou} lately. Compass has found new tips for you to make you feel better!`
                  });
                  webPush
                    .sendNotification(userSubscription.subscription, payload)
                    .catch((error: any) => Logger.error(error));
                  Logger.info(
                    "Notification for moodJournal sent to user: ",
                    moodJournal.uid
                );

                sentAlready.push(moodJournal.uid)
            }
        }
        sentAlready = []
    }
    Logger.info("Mood Journal Reminder sucesfully executed!");
    
    
  }
  catch (err) {
    Logger.error(`Error occurred while fetching mood journal reminders for user: ${err}`);
  }

  
}