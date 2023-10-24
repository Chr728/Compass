require("dotenv").config();
import { Request, Response } from "express";
import { Logger } from "../middlewares/logger";
import db from "../models";
import moment = require("moment-timezone");
const webPush = require("web-push");

export const subscribeUserReminders = async (req: Request, res: Response) => {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  // Set vapid keys
  webPush.setVapidDetails("mailto:test@gmail.com", publicKey, privateKey);

  try {
    const userUID = req.params.uid;
    const currenttime = moment.tz("America/Toronto").format("HH:mm:00");
    const currentdate = moment.tz("America/Toronto").format("YYYY-MM-DD");
    const timeForAppointments = 1;

    const subscription = req.body;

    //Get appointment of users for preperaing reminder
    const userAppointments = await db.Appointment.findAll({
      where: {
        uid: userUID,
        date: currentdate,
        time: currenttime,
      },
    });
    if (userAppointments.length > 0) {
      userAppointments.forEach((appointment: { appointmentWith: any }) => {
        const payload = JSON.stringify({
          title: `Appointment Reminder with Dr ${appointment.appointmentWith}`,
        });
        webPush
          .sendNotification(subscription, payload)
          .catch((error: any) => console.log(error));
      });
    }

    //Get activity journals of users for prepearing reminder
    const userActivityJournals = await db.ActivityJournal.findAll({
      where: {
        uid: userUID,
        date: currentdate,
        time: currenttime,
      },
    });
    if (userActivityJournals.length > 0) {
      userActivityJournals.forEach(
        (activityjournal: { activityjournal: any }) => {
          const payload = JSON.stringify({
            title: `Activity Reminder `,
          });
          webPush
            .sendNotification(subscription, payload)
            .catch((error: any) => console.log(error));
        }
      );
    }

    //Get food intake journals of users for preparing reminder
    const userFoodIntakeJournals = await db.FoodIntakeJournal.findAll({
      where: {
        uid: userUID,
        date: currentdate,
        time: currenttime,
      },
    });
    if (userFoodIntakeJournals.length > 0) {
      userFoodIntakeJournals.forEach(
        (userFoodIntakeJournal: { userFoodIntakeJournal: any }) => {
          const payload = JSON.stringify({
            title: `Food Intake Reminder `,
          });
          webPush
            .sendNotification(subscription, payload)
            .catch((error: any) => console.log(error));
        }
      );
    }

    //Get diabetic sub-journal1 of users for preparing remindner
    const userGlucoseMeasurement = await db.GlucoseMeasurement.findAll({
      where: {
        uid: userUID,
        mealTime: currenttime,
        date: currentdate,
      },
    });
    if (userGlucoseMeasurement.length > 0) {
      userGlucoseMeasurement.forEach(
        (GlucoseMeasurement: { GlucoseMeasurement: any }) => {
          const payload = JSON.stringify({
            title: `GlucoseMeasurement Reminder `,
          });
          webPush
            .sendNotification(subscription, payload)
            .catch((error: any) => console.log(error));
        }
      );
    }

    //Get diabetic sub-journal2 of users for preparing reminder
    const userInsulinDosage = await db.InsulinDosage.findAll({
      where: {
        uid: userUID,
        date: currentdate,
        time: currenttime,
      },
    });
    if (userInsulinDosage.length > 0) {
      userInsulinDosage.forEach((InsulinDosage: { InsulinDosage: any }) => {
        const payload = JSON.stringify({
          title: `Insulin Dosage Reminder `,
        });
        webPush
          .sendNotification(subscription, payload)
          .catch((error: any) => console.log(error));
      });
    }

    //Get medication of user for preparing reminder
    const userMedication = await db.Medication.findAll({
      where: {
        uid: userUID,
        time: currenttime,
      },
    });
    if (userMedication.length > 0) {
      userMedication.forEach((Medication: { Medication: any }) => {
        const payload = JSON.stringify({
          title: `Medication Reminder `,
        });
        webPush
          .sendNotification(subscription, payload)
          .catch((error: any) => console.log(error));
      });
    }

    const userReminders = {
      appointments: userAppointments,
      activityJournals: userActivityJournals,
      foodintakeJournals: userFoodIntakeJournals,
      glucoseMeasurments: userGlucoseMeasurement,
      insulinDosage: userInsulinDosage,
      medication: userMedication,
    };

    res.status(200).json({
      status: `SUCCESS`,
      data: userReminders,
    });
  } catch (err) {
    Logger.error(`Error occurred while fetching reminders for user: ${err}`);
    res.status(400).json({
      status: `ERROR`,
      message: `Error getting reminders of user : ${err}`,
    });
  }
};
