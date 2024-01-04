import { Request, Response, NextFunction } from "express";
import { Logger } from "../middlewares/logger";
import db from "../models";
import { weightJournalValidator } from '../utils/databaseValidators';
import { ErrorHandler } from '../middlewares/errorMiddleware';

export const getWeightJournals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await db.User.findOne({ where: { uid: req.params.uid } });

    if (!user) {
      throw new ErrorHandler(404, 'NOT_FOUND', 'User not found');
    }

    const weightJournals = await db.WeightJournal.findAll({ where: { uid: user.uid } });
    res.status(200).json({ status: 'SUCCESS', data: weightJournals });
  } catch (error) {
    Logger.error(`Error occurred while fetching weight journals: ${error}`);
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(new ErrorHandler(400, 'ERROR', `Error fetching weight journals: ${error}`));
    }
  }
};

export const getWeightJournal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const weightJournalId = req.params.weightJournalId;
    const weightJournal = await db.WeightJournal.findOne({ where: { id: weightJournalId } });

    if (!weightJournal) {
      throw new ErrorHandler(404, 'NOT_FOUND', 'Weight journal entry not found');
    }

    res.status(200).json({ status: 'SUCCESS', data: weightJournal });
  } catch (error) {
    Logger.error(`Error occurred while fetching weight journal entry: ${error}`);
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(new ErrorHandler(400, 'ERROR', `Error fetching weight journal entry: ${error}`));
    }
  }
};

export const createWeightJournal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await db.User.findOne({ where: { uid: req.params.uid } });

    if (!user) {
      throw new ErrorHandler(404, 'NOT_FOUND', 'User not found');
    }

    const { date, time, weight, height, unit, notes } = req.body;
    weightJournalValidator({ date, time, weight, height, unit, notes });

    const weightJournal = await db.WeightJournal.create({ uid: user.uid, date, time, weight, height, unit, notes });
    res.status(201).json({ status: 'SUCCESS', data: weightJournal });
  } catch (error) {
    Logger.error(`Error occurred while creating weight entry: ${error}`);
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(new ErrorHandler(400, 'ERROR', `Error creating weight entry: ${error}`));
    }
  }
};

export const updateWeightJournal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { date, time, weight, height, unit, notes } = req.body;
    weightJournalValidator({ date, time, weight, height, unit, notes });

    const weightJournalId = req.params.weightJournalId;
    const existingWeightJournal = await db.WeightJournal.findOne({ where: { id: weightJournalId } });

    if (!existingWeightJournal) {
      throw new ErrorHandler(404, 'NOT_FOUND', 'Weight journal entry not found');
    }

    await db.WeightJournal.update({ date, time, weight, height, unit, notes }, { where: { id: weightJournalId } });
    const updatedWeightJournal = await db.WeightJournal.findOne({ where: { id: weightJournalId } });

    res.status(200).json({ status: 'SUCCESS', message: 'Weight journal entry updated successfully', data: updatedWeightJournal });
  } catch (error) {
    Logger.error(`Error occurred while updating weight entry: ${error}`);
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(new ErrorHandler(400, 'ERROR', `Error updating weight entry: ${error}`));
    }
  }
};

export const deleteWeightJournal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const weightJournalId = req.params.weightJournalId;
    const existingWeightJournal = await db.WeightJournal.findOne({ where: { id: weightJournalId } });

    if (!existingWeightJournal) {
      throw new ErrorHandler(404, 'NOT_FOUND', 'Weight journal entry not found');
    }

    await db.WeightJournal.destroy({ where: { id: weightJournalId } });
    res.status(200).json({ status: 'SUCCESS', message: 'Weight journal entry deleted successfully' });
  } catch (error) {
    Logger.error(`Error occurred while deleting weight entry: ${error}`);
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(new ErrorHandler(400, 'ERROR', `Error deleting weight entry: ${error}`));
    }
  }
};
