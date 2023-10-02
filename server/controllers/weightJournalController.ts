import { Request, Response } from 'express';
import { Logger } from '../middlewares/logger';
import db from '../models';

export const getWeightJournals = async (req: Request, res: Response) => {
  try {
    const user = await db.User.findOne({
      where: {
        uid: req.params.id,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    const weightJournals = await db.WeightJournal.findAll({
      where: {
        uid: user.uid,
      },
    });

    return res.status(200).json({
      status: 'SUCCESS',
      data: weightJournals,
    });
  } catch (error) {
    Logger.error(`Error occurred while fetching weight journals: ${error}`);
    return res.status(400).json({
      status: 'ERROR',
      message: `Error fetching weight journals: ${error}`,
    });
  }
};

export const getWeightJournal = async (req: Request, res: Response) => {
  try {
    const weightJournalId = req.params.weightJournalId;
    const weightJournal = await db.WeightJournal.findOne({
      where: {
        id: weightJournalId,
      },
    });

    if (!weightJournal) {
      return res.status(404).json({
        status: 'NOT_FOUND',
        message: 'Weight journal entry not found',
      });
    }

    return res.status(200).json({
      status: 'SUCCESS',
      data: weightJournal,
    });
  } catch (error) {
    Logger.error(
      `Error occurred while fetching weight journal entry: ${error}`
    );
    return res.status(400).json({
      status: 'ERROR',
      message: `Error fetching weight journal entry: ${error}`,
    });
  }
};

export const createWeightJournal = async (req: Request, res: Response) => {
  try {
    const user = await db.User.findOne({
      where: {
        uid: req.params.id,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    const { date, time, weight, height, unit, notes } = req.body;

    const weightJournal = await db.WeightJournal.create({
      uid: user.uid,
      date,
      time,
      weight,
      height,
      unit,
      notes,
    });

    return res.status(201).json({ status: 'SUCCESS', data: weightJournal });
  } catch (error) {
    Logger.error(`Error occurred while creating weight entry: ${error}`);
    return res.status(400).json({
      status: 'ERROR',
      message: `Error creating weight entry: ${error}`,
    });
  }
};

export const updateWeightJournal = async (req: Request, res: Response) => {
  try {
    const { date, time, weight, height, unit, notes } = req.body;

    const weightJournalId = req.params.weightJournalId;

    const existingWeightJournal = await db.WeightJournal.findOne({
      where: {
        id: weightJournalId,
      },
    });

    if (!existingWeightJournal) {
      return res.status(404).json({
        status: 'NOT_FOUND',
        message: 'Weight journal entry not found',
      });
    }

    await db.WeightJournal.update(
      {
        date,
        time,
        weight,
        height,
        unit,
        notes,
      },
      {
        where: {
          id: weightJournalId,
        },
      }
    );

    const updatedWeightJournal = await db.WeightJournal.findOne({
      where: {
        id: weightJournalId,
      },
    });

    return res.status(200).json({
      status: 'SUCCESS',
      message: 'Weight journal entry updated successfully',
      data: updatedWeightJournal,
    });
  } catch (error) {
    Logger.error(`Error occurred while updating weight entry: ${error}`);
    return res.status(400).json({
      status: 'ERROR',
      message: `Error updating weight entry: ${error}`,
    });
  }
};

export const deleteWeightJournal = async (req: Request, res: Response) => {
  try {
    const weightJournalId = req.params.weightJournalId;

    const existingWeightJournal = await db.WeightJournal.findOne({
      where: {
        id: weightJournalId,
      },
    });

    if (!existingWeightJournal) {
      return res.status(404).json({
        status: 'NOT_FOUND',
        message: 'Weight journal entry not found',
      });
    }

    await db.WeightJournal.destroy({
      where: {
        id: weightJournalId,
      },
    });

    return res.status(200).json({
      status: 'SUCCESS',
      message: 'Weight journal entry deleted successfully',
    });
  } catch (error) {
    Logger.error(`Error occurred while deleting weight entry: ${error}`);
    return res.status(400).json({
      status: 'ERROR',
      message: `Error deleting weight entry: ${error}`,
    });
  }
};
