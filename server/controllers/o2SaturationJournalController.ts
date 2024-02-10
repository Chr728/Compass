import { Request, Response, NextFunction } from 'express';
import { Logger } from '../middlewares/logger';
import db from '../models';
import { diabeticInsulinJournalValidator } from '../utils/databaseValidators';
import { ErrorHandler } from '../middlewares/errorMiddleware';

export const getO2SaturationJournals = async (
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

    const o2SaturationJournals = await db.O2SaturationJournal.findAll({
      where: {
        uid: req.params.uid,
      },
    });

    return res.status(200).json({
      status: 'SUCCESS',
      data: o2SaturationJournals,
    });
  } catch (error) {
    Logger.error(
      `Error occurred while fetching o2 saturation journals: ${error}`
    );
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(
        new ErrorHandler(
          400,
          'ERROR',
          `Error fetching o2 saturation journals: ${error}`
        )
      );
    }
  }
};

export const getO2SaturationJournal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const o2SaturationJournalId = req.params.id;
    const o2SaturationJournal = await db.O2SaturationJournal.findOne({
      where: {
        id: o2SaturationJournalId,
      },
    });

    if (!o2SaturationJournal) {
      throw new ErrorHandler(
        404,
        'NOT_FOUND',
        'O2 Saturation Journal not found'
      );
    }

    return res.status(200).json({
      status: 'SUCCESS',
      data: o2SaturationJournal,
    });
  } catch (error) {
    Logger.error(
      `Error occurred while fetching o2 saturation journal: ${error}`
    );
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(
        new ErrorHandler(
          400,
          'ERROR',
          `Error fetching o2 saturation journal: ${error}`
        )
      );
    }
  }
};

export const createO2SaturationJournal = async (
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

    const { date, time, o2sat, pulse, activityLevel, notes } = req.body;
    const o2SaturationJournal = await db.O2SaturationJournal.create({
      uid: req.params.uid,
      date,
      time,
      o2sat,
      pulse,
      activityLevel,
      notes,
    });

    return res.status(201).json({
      status: 'SUCCESS',
      data: o2SaturationJournal,
    });
  } catch (error) {
    Logger.error(
      `Error occurred while creating o2 saturation journal: ${error}`
    );
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(
        new ErrorHandler(
          400,
          'ERROR',
          `Error creating o2 saturation journal: ${error}`
        )
      );
    }
  }
};

export const updateO2SaturationJournal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const o2SaturationJournalId = req.params.id;
    const o2SaturationJournal = await db.O2SaturationJournal.findOne({
      where: {
        id: o2SaturationJournalId,
      },
    });

    if (!o2SaturationJournal) {
      throw new ErrorHandler(
        404,
        'NOT_FOUND',
        'O2 Saturation Journal not found'
      );
    }

    const { date, time, o2sat, pulse, activityLevel, notes } = req.body;

    await db.O2SaturationJournal.update(
      { date, time, o2sat, pulse, activityLevel, notes },
      { where: { id: o2SaturationJournalId } }
    );

    const updatedO2SaturationJournal = await db.O2SaturationJournal.findOne({
      where: { id: o2SaturationJournalId },
    });

    return res.status(200).json({
      status: 'SUCCESS',
      data: updatedO2SaturationJournal,
    });
  } catch (error) {
    Logger.error(
      `Error occurred while updating o2 saturation journal: ${error}`
    );
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(
        new ErrorHandler(
          400,
          'ERROR',
          `Error updating o2 saturation journal: ${error}`
        )
      );
    }
  }
};

export const deleteO2SaturationJournal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const o2SaturationJournalId = req.params.id;
    const o2SaturationJournal = await db.O2SaturationJournal.findOne({
      where: { id: o2SaturationJournalId },
    });

    if (!o2SaturationJournal) {
      throw new ErrorHandler(
        404,
        'NOT_FOUND',
        'O2 Saturation Journal not found'
      );
    }

    await db.O2SaturationJournal.destroy({
      where: { id: o2SaturationJournalId },
    });

    return res.status(200).json({
      status: 'SUCCESS',
      message: 'O2 Saturation Journal deleted successfully',
    });
  } catch (error) {
    Logger.error(
      `Error occurred while deleting o2 saturation journal: ${error}`
    );
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(
        new ErrorHandler(
          400,
          'ERROR',
          `Error deleting o2 saturation journal: ${error}`
        )
      );
    }
  }
};
