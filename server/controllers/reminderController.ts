import { Request, Response } from "express";
import { Logger } from "../middlewares/logger";
import db from "../models";
import moment = require("moment-timezone");

export const getUserReminders = async (req: Request, res: Response) => {
  try {
    const userUID = req.params.uid;
    const currenttime = moment.tz("America/Toronto").format("HH:mm:00");
    const currentdate = moment.tz("America/Toronto").format("YYYY-MM-DD");

    //Get appointment of users for preperaing reminder
    const userAppointments = await db.Appointment.findAll({
      where: {
        uid: userUID,
        date: currentdate,
        time: currenttime,
      },
    });

    //Get activity journals of users for prepearing reminder
    const userActivityJournals = await db.ActivityJournal.findAll({
      where: {
        uid: userUID,
        date: currentdate,
        time: currenttime,
      },
    });

    //Get food intake journals of users for preparing reminder
    const userFoodIntakeJournals = await db.FoodIntakeJournal.findAll({
      where: {
        uid: userUID,
        date: currentdate,
        time: currenttime,
      },
    });

    //Get diabetic sub-journal1 of users for preparing remindner
    const userGlucoseMeasurement = await db.GlucoseMeasurement.findAll({
      where: {
        uid: userUID,
        mealTime: currenttime,
        date: currentdate,
      },
    });

    //Get diabetic sub-journal2 of users for preparing reminder
    const userInsulinDosage = await db.InsulinDosage.findAll({
      where: {
        uid: userUID,
        date: currentdate,
        time: currenttime,
      },
    });

    //Get medication of user for preparing reminder
    const userMedication = await db.Medication.findAll({
      where: {
        uid: userUID,
        time: currenttime,
      },
    });

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
