import { Request, Response } from "express";
import { Logger } from "../middlewares/logger";
import db from "../models";
import {notificationPreferenceValidator} from '../utils/databaseValidators';

// Create the notification preferences for a given user
export const createNotificationPreference = async (
  req: Request,
  res: Response
) => {
  try {
    const uid = req.params.uid;
    const [
      activityReminders,
      medicationReminders,
      appointmentReminders,
      foodIntakeReminders,
      insulinDosageReminders,
      glucoseMeasurementReminders,
    ] = [true, true, true, true, true, true];
    const createNotificationPreference = await db.NotificationPreference.create(
      {
        uid,
        activityReminders,
        medicationReminders,
        appointmentReminders,
        foodIntakeReminders,
        insulinDosageReminders,
        glucoseMeasurementReminders,
      }
    );

    res.status(201).json({
      status: `SUCCESS`,
      data: createNotificationPreference,
    });
  } catch (err) {
    Logger.error(
      `Error occurred while creating notification preference: ${err}`
    );
    res.status(400).json({
      status: `ERROR`,
      message: `Error creating notification preference : ${err}`,
    });
  }
};

// Retrieve notification preferences for a given user
export const getNotificationPreference = async (
  req: Request,
  res: Response
) => {
  try {
    const uid = req.params.uid;
    const notificationPreference = await db.NotificationPreference.findOne({
      where: {
        uid: uid,
      },
    });

    if (!notificationPreference) {
      return res.status(404).json({
        status: "ERROR",
        message: `Notification preference not found, invalid user id.`,
      });
    }

    res.status(200).json({
      status: `SUCCESS`,
      data: notificationPreference,
    });
  } catch (err) {
    Logger.error(
      `Error occurred while fetching notification preference: ${err}`
    );
    res.status(400).json({
      status: `ERROR`,
      message: `Error getting notification preference : ${err}`,
    });
  }
};

// Update notification preferences
export const updateNotificationPreference = async (
  req: Request,
  res: Response
) => {
  try {
    const uid = req.params.uid;
    const {
      activityReminders,
      medicationReminders,
      appointmentReminders,
      foodIntakeReminders,
      insulinDosageReminders,
      glucoseMeasurementReminders,
    } = req.body;
    notificationPreferenceValidator(req.body)
    const updatedNotificationPreference =
      await db.NotificationPreference.update(
        {
          activityReminders,
          medicationReminders,
          appointmentReminders,
          foodIntakeReminders,
          insulinDosageReminders,
          glucoseMeasurementReminders,
        },
        {
          where: {
            uid: uid,
          },
        }
      );

    if (!updatedNotificationPreference) {
      return res.status(404).json({
        status: "ERROR",
        message: "Notification preference not found, invalid user id.",
      });
    }

    const latestNotificationPreference =
      await db.NotificationPreference.findOne({
        where: {
          uid: uid,
        },
      });

    res.status(200).json({
      status: "SUCCESS",
      message: "Notification preference was updated successfully",
      data: latestNotificationPreference,
    });
  } catch (err) {
    Logger.error(
      `Error occurred while updating notification preference: ${err}`
    );
    res.status(400).json({
      status: `ERROR`,
      message: `Error updating notification preference : ${err}`,
    });
  }
};

// Function to delete notification preference of the user
export const deleteNotificationPreference = async (
  req: Request,
  res: Response
) => {
  try {
    const uid = req.params.uid;
    const deleteNotificationPreference =
      await db.NotificationPreference.destroy({
        where: {
          uid: uid,
        },
      });
    if (!deleteNotificationPreference) {
      return res.status(404).json({
        status: "ERROR",
        message: "Notification preference not found, invalid user id.",
      });
    }

    res.status(200).json({
      status: `SUCCESS`,
      data: `Successfully deleted notification preference.`,
    });
  } catch (err) {
    Logger.error(
      `Error occurred while deleting notification preference: ${err}`
    );
    res.status(400).json({
      status: "ERROR",
      message: `Error deleting notification preference: ${err}`,
    });
  }
};
