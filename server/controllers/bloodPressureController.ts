import { Request, Response, NextFunction } from 'express';
import { Logger } from '../middlewares/logger';
import db from '../models';
import {ErrorHandler} from "../middlewares/errorMiddleware";
import {bloodPressureJournalValidator} from "../utils/databaseValidators";

export const getBloodPressureJournals = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await db.User.findOne({
      where: {
        uid: req.params.uid,
      },
    });

    if (!user) {
      throw new ErrorHandler(404, 'NOT_FOUND', 'User not found');
    }

    const bloodPressureJournals = await db.BloodPressureJournal.findAll({
      where: {
        uid: req.params.uid,
      },
    });

    return res.status(200).json({
      status: 'SUCCESS',
      data: bloodPressureJournals,
    });
  } catch (error) {
    Logger.error(
      `Error occurred while fetching blood pressure journals: ${error}`
    );
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(
        new ErrorHandler(
          400,
          'ERROR',
          `Error fetching blood pressure journals: ${error}`
        )
      );
    }
  }
};

export const getBloodPressureJournal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bloodPressureJournalId = req.params.id;
    const bloodPressureJournal = await db.BloodPressureJournal.findOne({
      where: {
        id: bloodPressureJournalId,
      },
    });

    if (!bloodPressureJournal) {
      throw new ErrorHandler(404, 'NOT_FOUND', 'Blood pressure journal not found');
    }

    return res.status(200).json({
      status: 'SUCCESS',
      data: bloodPressureJournal,
    });
  } catch (error) {
    Logger.error(
      `Error occurred while fetching blood pressure journal: ${error}`
    );
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(
        new ErrorHandler(
          400,
          'ERROR',
          `Error fetching blood pressure journal: ${error}`
        )
      );
    }
  }
};

export const createBloodPressureJournal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await db.User.findOne({
      where: {
        uid: req.body.uid,
      },
    });

    if (!user) {
      throw new ErrorHandler(404, 'NOT_FOUND', 'User not found');
    }
    const {  date, time, systolic, diastolic, pulse, notes } = req.body;
   bloodPressureJournalValidator(req.body);
    const bloodPressureJournal = await db.BloodPressureJournal.create({
      uid: req.body.uid,
      date,
      time,
      systolic,
      diastolic,
      pulse,
      notes,
    });
    return res.status(201).json({
      status: 'SUCCESS',
      data: bloodPressureJournal,
    });
  } catch (error) {
    Logger.error(
      `Error occurred while creating blood pressure journal: ${error}`
    );
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(
        new ErrorHandler(
          400,
          'ERROR',
          `Error creating blood pressure journal: ${error}`
        )
      );
    }
  }
};

export const updateBloodPressureJournal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bloodPressureJournalId = req.params.id;
    const bloodPressureJournal = await db.BloodPressureJournal.findOne({
      where: {
        id: bloodPressureJournalId,
      },
    });

    if (!bloodPressureJournal) {
      throw new ErrorHandler(
          404,
          'NOT_FOUND',
          'Blood pressure journal not found'
      );
    }

    const {date, time, systolic, diastolic, pulse, notes} = req.body;
    bloodPressureJournalValidator(req.body)
    await db.BloodPressureJournal.update(
        {
          date,
          time,
          systolic,
          diastolic,
          pulse,
          notes,
        },
        { where: { id: bloodPressureJournalId } }
    );

    const updatedBloodPressureJournal = await db.BloodPressureJournal.findOne({
      where: { id: bloodPressureJournalId },
    });

    return res.status(200).json({
      status: 'SUCCESS',
      data: updatedBloodPressureJournal
    });
  } catch (error) {
    Logger.error(
        `Error occurred while updating blood pressure journal: ${error}`
    );
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(
          new ErrorHandler(
              400,
              'ERROR',
              `Error updating blood pressure journal: ${error}`
          )
      );
    }
  }
};

export const deleteBloodPressureJournal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bloodPressureJournalId = req.params.id;
    const bloodPressureJournal = await db.BloodPressureJournal.findOne({
      where: {
        id: bloodPressureJournalId,
      },
    });

    if (!bloodPressureJournal) {
      throw new ErrorHandler(404, 'NOT_FOUND', 'Blood pressure journal not found');
    }

    await db.BloodPressureJournal.destroy({
      where: {
        id: bloodPressureJournalId,
      },
    });

    return res.status(200).json({
      status: 'SUCCESS',
      message: 'Blood pressure journal deleted successfully',
    });
  } catch (error) {
    Logger.error(
      `Error occurred while deleting blood pressure journal: ${error}`
    );
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(
        new ErrorHandler(
          400,
          'ERROR',
          `Error deleting blood pressure journal: ${error}`
        )
      );
    }
  }
};