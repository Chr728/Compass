import { Request, Response } from "express";
import { Logger } from "../middlewares/logger";
import db from "../models";
import { appointmentValidator } from "../utils/databaseValidators";

export const getAppointments = async (req: Request, res: Response) => {
  try {
    const userEmail = req.params.email;
    const userAppointments = await db.Appointment.findAll({
      where: {
        email: userEmail,
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

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const { appointmentWith, reason, date, time, notes } = req.body;
    appointmentValidator(req.body);
    const createdAppointment = await db.Appointment.create({
      email,
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


export const getAppointment = async (req: Request, res: Response) => {};

export const deleteAppointment = async (req: Request, res: Response) => {};