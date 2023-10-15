import { Request, Response } from "express";
import { Logger } from "../middlewares/logger";
import db from "../models";

export const getUserReminders = async (req: Request, res: Response) => {
  try {
    const userUID = req.params.uid;

    const userAppointments = await db.Appointment.findAll({
      where: {
        uid: userUID,
      },
    });

    const userActivityJournals = await db.ActivityJournal.findAll({
      where: {
        uid: userUID,
      },
    });

    const userFoodIntakeJournals = await db.FoodIntakeJournal.findAll({
      where: {
        uid: userUID,
      },
    });

    const userGlucoseMeasurement = await db.GlucoseMeasurement.findAll({
      where: {
        uid: userUID,
      },
    });

    const userInsulinDosage = await db.InsulinDosage.findAll({
      where: {
        uid: userUID,
      },
    });

    const userMedication = await db.Medication.findAll({
      where: {
        uid: userUID,
      },
    });

    const userMoodJournal = await db.MoodJournal.findAll({
      where: {
        uid: userUID,
      },
    });

    const userWeightJournal = await db.WeightJournal.findAll({
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
      moodJournals: userMoodJournal,
      weightJournals: userWeightJournal,
    };

    res.status(200).json({
      status: `SUCCESS`,
      data: userReminders,
    });
  } catch (err) {
    Logger.error(`Error occurred while fetching appointment for user: ${err}`);
    res.status(400).json({
      status: `ERROR`,
      message: `Error getting appointments of user : ${err}`,
    });
  }
};
