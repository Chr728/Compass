require("dotenv").config();
import { Logger } from "../middlewares/logger";
import db from "../models";
import moment = require("moment-timezone");
const webPush = require("web-push");


export const sendMoodReminder = async () => {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  // Set vapid keys
  webPush.setVapidDetails("mailto:test@gmail.com", publicKey, privateKey);

  try{
    
    //Get current Date
    const currentDate = moment.tz("America/Toronto").format("YYYY-MM-DD");

    //Get all mood journal entries that correspond to current Date
    const moodJournals = await db.MoodJournal.findAll({
        where:{
            date: currentDate
        }
    })

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

            const payload = JSON.stringify({
                title: `Your latest mood journal entry has been assesed. New tips have arrived!`,
              });
              webPush
                .sendNotification(userSubscription.subscription, payload)
                .catch((error: any) => Logger.error(error));
              Logger.info(
                "Notification for moodJournal sent to user: ",
                moodJournal.uid
            );
        }
    }
    Logger.info("Mood Journal Reminder sucesfully executed!");
  }
  catch (err) {
    Logger.error(`Error occurred while fetching mood journal reminders for user: ${err}`);
  }

  
}