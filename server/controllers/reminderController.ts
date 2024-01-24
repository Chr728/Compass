require("dotenv").config();
import { Request, Response } from "express";
import { Logger } from "../middlewares/logger";
import db from "../models";
import moment = require("moment-timezone");
const webPush = require("web-push");

export const sendUserReminders = async () => {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  // Set vapid keys
  webPush.setVapidDetails("mailto:test@gmail.com", publicKey, privateKey);

  try {
    // Get the current time and date
    const currentTime = moment.tz("America/Toronto").format("HH:mm:00");
    const currentDate = moment.tz("America/Toronto").format("YYYY-MM-DD");

    // Calculate the start time that is exactly 3 hours ahead of the current time for appointments
    const startTimeAppointments = moment(currentTime, "HH:mm:ss").add(
      3,
      "hours"
    );

    // Calculate the end time for appointments which is 10-minutes ahead of the start time
    const endTimeAppointments = startTimeAppointments
      .clone()
      .add(10, "minutes");

    // Calculate the start time and end time of the 10-minute period of notifications
    const startTime = moment(currentTime, "HH:mm:ss");
    const endTime = startTime.clone().add(10, "minutes");

    // Start time in minutes for comparison
    const startTimeMinutes =
      parseInt(startTime.format("HH:mm:00").substring(0, 2), 10) * 60 +
      parseInt(startTime.format("HH:mm:00").substring(3, 5), 10);

    // 10 minutes after start time
    const thirtyMinutesLater = startTimeMinutes + 10;

    // Define time-string pairs for glucose journals and medication
    const timeStrings: [string, number][] = [
      ["Before breakfast", 7 * 60],
      ["30min after breakfast", 8 * 60 + 30],
      ["2hrs after breakfast", 10 * 60],
      ["Before lunch", 11 * 60],
      ["30min after lunch", 12 * 60 + 30],
      ["2hrs after lunch", 14 * 60],
      ["Before dinner", 17 * 60],
      ["30min after dinner", 18 * 60 + 30],
      ["2hrs after dinner", 20 * 60],
      ["Bedtime", 21 * 60],
      ["Night", 22 * 60],
    ];

    // Find which string is associated to current time
    let mealTime = "nothing";
    for (const [text, time] of timeStrings) {
      if (time >= startTimeMinutes && time <= thirtyMinutesLater) {
        mealTime = text;
        break;
      }
    }
    Logger.info(`This is the meal time for glucose: ${mealTime}`);

    //Get appointment of users for preperaing reminder
    const userAppointments = await db.Appointment.findAll({
      where: {
        date: currentDate,
        time: {
          [db.Sequelize.Op.gte]: startTimeAppointments.format("HH:mm:00"),
          [db.Sequelize.Op.lt]: endTimeAppointments.format("HH:mm:00"),
        },
      },
    });

    // Iterate through appointments found between the duration specified
    if (userAppointments.length > 0) {
      for (const appointment of userAppointments) {
        // Retrieve notification preference first.
        const userNotificationPreferences =
          await db.NotificationPreference.findOne({
            where: {
              uid: appointment.uid,
            },
          });

        // Return if there's an error
        if (!userNotificationPreferences) {
          Logger.error(`Notification preference not found, invalid user id.`);
          return;
        }

        if (userNotificationPreferences.appointmentReminders) {
          // Retrieve subscription from database
          const userSubscription = await db.Subscription.findOne({
            where: {
              uid: appointment.uid,
            },
          });

          if (!userSubscription) {
            Logger.error(`No Subscription was found.`);
            continue;
          }

          const payload = JSON.stringify({
            title: `Appointment Reminder with Dr ${appointment.appointmentWith} at ${appointment.time}`,
          });
          webPush
            .sendNotification(userSubscription.subscription, payload)
            .catch((error: any) => Logger.error(error));
        }
      }
    }

    //Get activity journals of users for prepearing reminder
    const userActivityJournals = await db.ActivityJournal.findAll({
      where: {
        date: currentDate,
        time: {
          [db.Sequelize.Op.gte]: startTime.format("HH:mm:00"),
          [db.Sequelize.Op.lt]: endTime.format("HH:mm:00"),
        },
      },
    });

    // Iterate through activities found between the duration specified
    if (userActivityJournals.length > 0) {
      for (const activityjournal of userActivityJournals) {
        // Retrieve notification preference first.
        const userNotificationPreferences =
          await db.NotificationPreference.findOne({
            where: {
              uid: activityjournal.uid,
            },
          });

        // Return if there's an error
        if (!userNotificationPreferences) {
          Logger.error(`Notification preference not found, invalid user id.`);
          return;
        }

        if (userNotificationPreferences.activityReminders) {
          // Retrieve subscription from database
          const userSubscription = await db.Subscription.findOne({
            where: {
              uid: activityjournal.uid,
            },
          });

          if (!userSubscription) {
            Logger.error(`No Subscription was found.`);
            continue;
          }

          const payload = JSON.stringify({
            title: `Activity Reminder: ${activityjournal.activity} at ${activityjournal.time}`,
          });

          webPush
            .sendNotification(userSubscription.subscription, payload)
            .catch((error: any) => Logger.error(error));
        }
      }
    }

    //Get food intake journals of users for preparing reminder
    const userFoodIntakeJournals = await db.FoodIntakeJournal.findAll({
      where: {
        date: currentDate,
        time: {
          [db.Sequelize.Op.gte]: startTime.format("HH:mm:00"),
          [db.Sequelize.Op.lt]: endTime.format("HH:mm:00"),
        },
      },
    });

    // Iterate through food intake journals found between the duration specified
    if (userFoodIntakeJournals.length > 0) {
      for (const foodIntakeJournal of userFoodIntakeJournals) {
        // Retrieve notification preference first.
        const userNotificationPreferences =
          await db.NotificationPreference.findOne({
            where: {
              uid: foodIntakeJournal.uid,
            },
          });

        // Return if there's an error
        if (!userNotificationPreferences) {
          Logger.error(`Notification preference not found, invalid user id.`);
          return;
        }

        if (userNotificationPreferences.foodIntakeReminders) {
          // Retrieve subscription from database
          const userSubscription = await db.Subscription.findOne({
            where: {
              uid: foodIntakeJournal.uid,
            },
          });

          if (!userSubscription) {
            Logger.error(`No Subscription was found.`);
            continue;
          }

          const payload = JSON.stringify({
            title: `Food Intake Reminder: ${foodIntakeJournal.foodName} for ${foodIntakeJournal.servingNumber} servings at ${foodIntakeJournal.time}`,
          });
          webPush
            .sendNotification(userSubscription.subscription, payload)
            .catch((error: any) => Logger.error(error));
        }
      }
    }

    //Get diabetic sub-journal1 of users for preparing remindner
    const userGlucoseMeasurement = await db.GlucoseMeasurement.findAll({
      where: {
        mealTime: mealTime,
        date: currentDate,
      },
    });

    // Iterate through glucose measurement journals found between the duration specified
    if (userGlucoseMeasurement.length > 0) {
      for (const glucoseMeasurement of userGlucoseMeasurement) {
        // Retrieve notification preference first.
        const userNotificationPreferences =
          await db.NotificationPreference.findOne({
            where: {
              uid: glucoseMeasurement.uid,
            },
          });

        // Return if there's an error
        if (!userNotificationPreferences) {
          Logger.error(`Notification preference not found, invalid user id.`);
          return;
        }

        if (userNotificationPreferences.glucoseMeasurementReminders) {
          // Retrieve subscription from database
          const userSubscription = await db.Subscription.findOne({
            where: {
              uid: glucoseMeasurement.uid,
            },
          });

          if (!userSubscription) {
            Logger.error(`No Subscription was found.`);
            continue;
          }

          const payload = JSON.stringify({
            title: `GlucoseMeasurement Reminder: ${glucoseMeasurement.bloodGlucose} ${glucoseMeasurement.unit} for ${glucoseMeasurement.mealTime}`,
          });
          webPush
            .sendNotification(userSubscription.subscription, payload)
            .catch((error: any) => Logger.error(error));
        }
      }
    }

    //Get diabetic sub-journal2 of users for preparing reminder
    const userInsulinDosages = await db.InsulinDosage.findAll({
      where: {
        date: currentDate,
        time: {
          [db.Sequelize.Op.gte]: startTime.format("HH:mm:00"),
          [db.Sequelize.Op.lt]: endTime.format("HH:mm:00"),
        },
      },
    });

    // Iterate through insulin dosage journals found between the duration specified
    if (userInsulinDosages.length > 0) {
      for (const insulinDosage of userInsulinDosages) {
        // Retrieve notification preference first.
        const userNotificationPreferences =
          await db.NotificationPreference.findOne({
            where: {
              uid: insulinDosage.uid,
            },
          });

        // Return if there's an error
        if (!userNotificationPreferences) {
          Logger.error(`Notification preference not found, invalid user id.`);
          return;
        }

        if (userNotificationPreferences.insulinDosageReminders) {
          // Retrieve subscription from database
          const userSubscription = await db.Subscription.findOne({
            where: {
              uid: insulinDosage.uid,
            },
          });

          if (!userSubscription) {
            Logger.error(`No Subscription was found.`);
            continue;
          }

          const payload = JSON.stringify({
            title: `Insulin Dosage Reminder: ${insulinDosage.typeOfInsulin} ${insulinDosage.unit} for the ${insulinDosage.bodySite} at ${insulinDosage.time}`,
          });
          webPush
            .sendNotification(userSubscription, payload)
            .catch((error: any) => Logger.error(error));
        }
      }
    }

    //Get medication of user for preparing reminder
    const userMedications = await db.Medication.findAll({
      where: {
        time: {
          [db.Sequelize.Op.gte]: startTime.format("HH:mm:00"),
          [db.Sequelize.Op.lt]: endTime.format("HH:mm:00"),
        },
      },
    });
    if (userMedications.length > 0) {
      for (const medication of userMedications) {
        // Retrieve notification preference first.
        const userNotificationPreferences =
          await db.NotificationPreference.findOne({
            where: {
              uid: medication.uid,
            },
          });

        // Return if there's an error
        if (!userNotificationPreferences) {
          Logger.error(`Notification preference not found, invalid user id.`);
          return;
        }

        if (userNotificationPreferences.medicationReminders) {
          // Retrieve subscription from database
          const userSubscription = await db.Subscription.findOne({
            where: {
              uid: medication.uid,
            },
          });

          if (!userSubscription) {
            Logger.error(`No Subscription was found.`);
            continue;
          }
          const payload = JSON.stringify({
            title: `Medication Reminder:  ${medication.medicationName} for ${medication.dosage} ${medication.unit} at ${medication.time}`,
          });
          webPush
            .sendNotification(userSubscription, payload)
            .catch((error: any) => Logger.error(error));
        }
      }
    }

    Logger.info("Reminders task successfully executed!");
  } catch (err) {
    Logger.error(`Error occurred while fetching reminders for user: ${err}`);
  }
};
