import { Request, Response, NextFunction } from 'express';
import { Logger } from '../middlewares/logger';
import db from '../models';
import { appointmentValidator } from '../utils/databaseValidators';
import { ErrorHandler } from '../middlewares/errorMiddleware';

export const getAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const uid = req.params.uid;
    const userAppointments = await db.Appointment.findAll({
      where: {
        uid: uid,
      },
    });

    res.status(200).json({
      status: `SUCCESS`,
      data: userAppointments,
    });
  } catch (err) {
    Logger.error(`Error occurred while fetching appointment for user: ${err}`);
    if (err instanceof ErrorHandler) {
      next(err);
    } else {
      next(
        new ErrorHandler(
          400,
          'ERROR',
          `Error getting appointments of user: ${err}`
        )
      );
    }
  }
};

export const createAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const uid = req.params.uid;
    const { appointmentWith, reason, date, time, frequency, quantity, notes } =
      req.body;
    appointmentValidator(req.body);
    const createdAppointment = await db.Appointment.create({
      uid,
      appointmentWith,
      reason,
      date,
      time,
      frequency,
      quantity,
      notes,
    });
    res.status(201).json({
      status: `SUCCESS`,
      data: createdAppointment,
    });
  } catch (err) {
    Logger.error(`Error occurred while creating appointment: ${err}`);
    if (err instanceof ErrorHandler) {
      next(err);
    } else {
      next(
        new ErrorHandler(
          400,
          'ERROR',
          `Error creating appointment record: ${err}`
        )
      );
    }
  }
};

export const getAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await db.Appointment.findOne({
      where: {
        id: appointmentId,
      },
    });

    if (!appointment) {
      throw new ErrorHandler(
        404,
        'ERROR',
        `Appointment not found, invalid appointment id.`
      );
    }

    res.status(200).json({
      status: `SUCCESS`,
      data: appointment,
    });
  } catch (err) {
    Logger.error(`Error occurred while fetching appointment: ${err}`);
    if (err instanceof ErrorHandler) {
      next(err);
    } else {
      next(new ErrorHandler(400, 'ERROR', `Error getting appointment: ${err}`));
    }
  }
};

export const deleteAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointmentId = req.params.id;
    const deletedAppointment = await db.Appointment.destroy({
      where: {
        id: appointmentId,
      },
    });

    if (!deletedAppointment) {
      throw new ErrorHandler(
        404,
        'ERROR',
        'Appointment not found, invalid appointment id.'
      );
    }

    res.status(200).json({
      status: `SUCCESS`,
      data: `Successfully deleted appointment.`,
    });
  } catch (err) {
    Logger.error(`Error occurred while deleting appointment: ${err}`);
    if (err instanceof ErrorHandler) {
      next(err);
    } else {
      next(
        new ErrorHandler(
          400,
          'ERROR',
          `Error deleting appointment record: ${err}`
        )
      );
    }
  }
};

export const updateAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointmentId = req.params.id;
    const { appointmentWith, reason, date, time, notes } = req.body;

    const updatedAppointment = await db.Appointment.update(
      { appointmentWith, reason, date, time, notes },
      {
        where: {
          id: appointmentId,
        },
      }
    );

    if (!updatedAppointment) {
      throw new ErrorHandler(
        404,
        'ERROR',
        'Appointment not found, invalid appointment id.'
      );
    }

    const latestAppointment = await db.Appointment.findOne({
      where: {
        id: appointmentId,
      },
    });

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Appointment was updated successfully',
      data: latestAppointment,
    });
  } catch (error) {
    Logger.error(`Error occurred while updating appointment: ${error}`);
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(
        new ErrorHandler(400, 'ERROR', `Error updating appointment: ${error}`)
      );
    }
  }
};
