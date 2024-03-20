import { Request, Response, NextFunction } from "express";
import { Logger } from "../middlewares/logger";
import db from "../models";
import { notificationPreferenceValidator } from "../utils/databaseValidators";
import { ErrorHandler } from "../middlewares/errorMiddleware";

export const createNotificationPreference = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const uid = req.params.uid;
    const user = await db.User.findOne({ where: { uid } });
    if (!user) {
      throw new ErrorHandler(404, "ERROR", "User not found, invalid user uid.");
    }

    const {
      permissionGranted,
      activityReminders,
      medicationReminders,
      appointmentReminders,
      foodIntakeReminders,
      insulinDosageReminders,
      glucoseMeasurementReminders,
      moodReminders,
    } = req.body;
    notificationPreferenceValidator(req.body);
    const createNotificationPreference = await db.NotificationPreference.create(
      {
        uid,
        permissionGranted,
        activityReminders,
        medicationReminders,
        appointmentReminders,
        foodIntakeReminders,
        insulinDosageReminders,
        glucoseMeasurementReminders,
        moodReminders,
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
    if (err instanceof ErrorHandler) {
      next(err);
    } else {
      next(
        new ErrorHandler(
          400,
          "ERROR",
          `Error creating notification preference: ${err}`
        )
      );
    }
  }
};

export const getNotificationPreference = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const uid = req.params.uid;
    const notificationPreference = await db.NotificationPreference.findOne({
      where: { uid },
    });
    if (!notificationPreference) {
      throw new ErrorHandler(
        404,
        "ERROR",
        `Notification preference not found, invalid user id.`
      );
    }

    res.status(200).json({
      status: `SUCCESS`,
      data: notificationPreference,
    });
  } catch (err) {
    Logger.error(
      `Error occurred while fetching notification preference: ${err}`
    );
    if (err instanceof ErrorHandler) {
      next(err);
    } else {
      next(
        new ErrorHandler(
          400,
          "ERROR",
          `Error getting notification preference: ${err}`
        )
      );
    }
  }
};

export const updateNotificationPreference = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const uid = req.params.uid;
    const {
      permissionGranted,
      activityReminders,
      medicationReminders,
      appointmentReminders,
      foodIntakeReminders,
      insulinDosageReminders,
      glucoseMeasurementReminders,
      moodReminders,
    } = req.body;
    notificationPreferenceValidator(req.body);
    const updatedNotificationPreference =
      await db.NotificationPreference.update(
        {
          permissionGranted,
          activityReminders,
          medicationReminders,
          appointmentReminders,
          foodIntakeReminders,
          insulinDosageReminders,
          glucoseMeasurementReminders,
          moodReminders,
        },
        { where: { uid } }
      );

    if (!updatedNotificationPreference) {
      throw new ErrorHandler(
        404,
        "ERROR",
        "Notification preference not found, invalid user id."
      );
    }

    const latestNotificationPreference =
      await db.NotificationPreference.findOne({ where: { uid } });
    res.status(200).json({
      status: "SUCCESS",
      message: "Notification preference was updated successfully",
      data: latestNotificationPreference,
    });
  } catch (err) {
    Logger.error(
      `Error occurred while updating notification preference: ${err}`
    );
    if (err instanceof ErrorHandler) {
      next(err);
    } else {
      next(
        new ErrorHandler(
          400,
          "ERROR",
          `Error updating notification preference: ${err}`
        )
      );
    }
  }
};

export const deleteNotificationPreference = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const uid = req.params.uid;
    const deleteNotificationPreference =
      await db.NotificationPreference.destroy({ where: { uid } });
    if (!deleteNotificationPreference) {
      throw new ErrorHandler(
        404,
        "ERROR",
        "Notification preference not found, invalid user id."
      );
    }

    res.status(200).json({
      status: `SUCCESS`,
      data: `Successfully deleted notification preference.`,
    });
  } catch (err) {
    Logger.error(
      `Error occurred while deleting notification preference: ${err}`
    );
    if (err instanceof ErrorHandler) {
      next(err);
    } else {
      next(
        new ErrorHandler(
          400,
          "ERROR",
          `Error deleting notification preference: ${err}`
        )
      );
    }
  }
};
