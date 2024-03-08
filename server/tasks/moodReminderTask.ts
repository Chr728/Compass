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