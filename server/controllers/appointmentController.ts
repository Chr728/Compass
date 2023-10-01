import { Request, Response } from "express";
import { Logger } from "../middlewares/logger";
import db from "../models";
import { appointmentValidator } from "../utils/databaseValidators";

//Retrieve all appoinments for a given user
export const getAppointments = async (req: Request, res: Response) => {
  try {
    const userUID = req.params.id;
    const userAppointments = await db.Appointment.findAll({
      where: {
        uid: userUID,
      },
    });

    if (!userAppointments) {
      return res.status(404).json({
        status: "ERROR",
        message: `No appointment was found for this user.`,
      });
    } else {
      res.status(200).json({
        status: `SUCCESS`,
        data: userAppointments,
      });
    }
  } catch (err) {
    Logger.error(`Error occurred while fetching appointment for user: ${err}`);
    res.status(400).json({
      status: `ERROR`,
      message: `Error getting appointments of user : ${err}`,
    });
  }
};

//Create appointment for a user
export const createAppointment = async (req: Request, res: Response) => {
  try {
    const uid = req.params.id;
    const { appointmentWith, reason, date, time, notes } = req.body;
    appointmentValidator(req.body);
    const createdAppointment = await db.Appointment.create({
      uid,
      appointmentWith,
      reason,
      date,
      time,
      notes,
    });
    res.status(201).json({
      status: `SUCCESS`,
      data: createdAppointment,
    });
  } catch (err) {
    Logger.error(`Error occurred while creating appointment: ${err}`);
    res.status(400).json({
      status: `ERROR`,
      message: `Error creating appointment record: ${err}`,
    });
  }
};

export const getAppointment = async (req: Request, res: Response) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await db.Appointment.findOne({
      where: {
        id: appointmentId,
      },
    });

    if (!appointment) {
      return res.status(404).json({
        status: "ERROR",
        message: `Appointment not found, invalid appointment id.`,
      });
    }

    res.status(200).json({
      status: `SUCCESS`,
      data: appointment,
    });
  } catch (err) {
    Logger.error(`Error occurred while fetching appointment: ${err}`);
    res.status(400).json({
      status: `ERROR`,
      message: `Error getting appointment : ${err}`,
    });
  }
};

export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const appointmentId = req.params.id;
    const deletedAppointment = await db.Appointment.destroy({
      where: {
        id: appointmentId,
      },
    });

    if (!deletedAppointment) {
      return res.status(404).json({
        status: "ERROR",
        message: "Appointment not found, invalid appointment id.",
      });
    }

    res.status(200).json({
      status: `SUCCESS`,
      data: `Successfully deleted appointment.`,
    });
  } catch (err) {
    Logger.error(`Error occurred while deleting appointment: ${err}`);
    res.status(400).json({
      status: "ERROR",
      message: `Error deleting appointment record: ${err}`,
    });
  }
};
