import { Request, Response, NextFunction } from 'express';
import { Logger } from '../middlewares/logger';
import db from '../models';
import { diabeticInsulinJournalValidator } from '../utils/databaseValidators';
import { ErrorHandler } from '../middlewares/errorMiddleware';

export const getInsulinJournals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await db.User.findOne({
      where: {
        uid: req.params.uid,
      },
    });
    if (!user) {
      throw new ErrorHandler(404, 'NOT_FOUND', 'User not found');
    }
    const insulinJournals = await db.InsulinDosage.findAll({
      where: {
        uid: req.params.uid,
      },
    });
    return res.status(200).json({
      status: 'SUCCESS',
      data: insulinJournals,
    });
  } catch (error) {
    Logger.error(`Error occurred while fetching insulin journals: ${error}`);
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(new ErrorHandler(400, 'ERROR', `Error fetching insulin journals: ${error}`));
    }
  }
};

export const getInsulinJournal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const insulinJournalId = req.params.id;
    const insulinJournal = await db.InsulinDosage.findOne({
      where: {
        id: insulinJournalId,
      },
    });
    if (!insulinJournal) {
      throw new ErrorHandler(404, 'NOT_FOUND', 'Insulin Journal not found');
    }
    return res.status(200).json({
      status: 'SUCCESS',
      data: insulinJournal,
    });
  } catch (error) {
    Logger.error(`Error occurred while fetching insulin journal: ${error}`);
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(new ErrorHandler(400, 'ERROR', `Error fetching insulin journal: ${error}`));
    }
  }
};

export const createInsulinJournal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userID = req.params.uid;
    const user = await db.User.findOne({
      where: {
        uid: userID,
      },
    });
    if (!user) {
      throw new ErrorHandler(404, 'NOT_FOUND', 'User not found');
    }
    const { date, time, typeOfInsulin, unit, bodySite, notes } = req.body;
    diabeticInsulinJournalValidator(req.body);
    const insulinJournal = await db.InsulinDosage.create({
      uid: userID,
      date,
      time,
      typeOfInsulin,
      unit,
      bodySite,
      notes,
    });
    return res.status(201).json({
      status: 'SUCCESS',
      data: insulinJournal,
    });
  } catch (error) {
    Logger.error(`Error occurred while creating insulin journal: ${error}`);
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(new ErrorHandler(400, 'ERROR', `Error creating insulin journal: ${error}`));
    }
  }
};

export const updateInsulinJournal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const insulinJournalId = req.params.id;
    const insulinJournal = await db.InsulinDosage.findOne({
      where: {
        id: insulinJournalId,
      },
    });
    if (!insulinJournal) {
      throw new ErrorHandler(404, 'NOT_FOUND', 'Insulin Journal not found');
    }
    const { date, time, typeOfInsulin, unit, bodySite, notes } = req.body;
    diabeticInsulinJournalValidator(req.body);
    await db.InsulinDosage.update(
        { date, time, typeOfInsulin, unit, bodySite, notes },
        { where: { id: insulinJournalId } }
    );
    const updatedInsulinJournal = await db.InsulinDosage.findOne({
      where: { id: insulinJournalId },
    });
    return res.status(200).json({
      status: 'SUCCESS',
      data: updatedInsulinJournal,
    });
  } catch (error) {
    Logger.error(`Error occurred while updating insulin journal: ${error}`);
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(new ErrorHandler(400, 'ERROR', `Error updating insulin journal: ${error}`));
    }
  }
};

export const deleteInsulinJournal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const insulinJournalId = req.params.id;
    const insulinJournal = await db.InsulinDosage.findOne({
      where: { id: insulinJournalId },
    });
    if (!insulinJournal) {
      throw new ErrorHandler(404, 'NOT_FOUND', 'Insulin Journal not found');
    }
    await db.InsulinDosage.destroy({ where: { id: insulinJournalId } });
    return res.status(200).json({
      status: 'SUCCESS',
      message: 'Insulin Journal deleted successfully',
    });
  } catch (error) {
    Logger.error(`Error occurred while deleting insulin journal: ${error}`);
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(new ErrorHandler(400, 'ERROR', `Error deleting insulin journal: ${error}`));
    }
  }
};
