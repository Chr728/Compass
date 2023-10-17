import { Request, Response } from "express";
import { Logger } from "../middlewares/logger";
import db from "../models";

export const getUserReminders = async (req: Request, res: Response) => {
  try {
    const userUID = req.params.uid;

    //Get appointment of users for preperaing reminder
    const userAppointments = await db.Appointment.findAll({
      where: {
        uid: userUID,
      },
    });

    //Get activity journals of users for prepearing reminder
    const userActivityJournals = await db.ActivityJournal.findAll({
      where: {
        uid: userUID,
      },
    });

    //Get food intake journals of users for preparing reminder
    const userFoodIntakeJournals = await db.FoodIntakeJournal.findAll({
      where: {
        uid: userUID,
      },
    });

    //Get diabetic sub-journal1 of users for preparing remindner
    const userGlucoseMeasurement = await db.GlucoseMeasurement.findAll({
      where: {
        uid: userUID,
      },
    });

    //Get diabetic sub-journal2 of users for preparing reminder
    const userInsulinDosage = await db.InsulinDosage.findAll({
      where: {
        uid: userUID,
      },
    });

    //Get medication of user for preparing reminder
    const userMedication = await db.Medication.findAll({
      where: {
        uid: userUID,
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
