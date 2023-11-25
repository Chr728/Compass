import { Request, Response } from 'express';
import { Logger } from '../middlewares/logger';
import db from '../models';

export const getGlucoseJournals = async (req: Request, res: Response) => {
  try {
    const user = await db.User.findOne({
      where: {
        uid: req.params.uid,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    const glucoseJournals = await db.GlucoseMeasurement.findAll({
      where: {
        uid: req.params.uid,
      },
    });

    return res.status(200).json({
      status: 'SUCCESS',
      data: glucoseJournals,
    });
  } catch (error) {
    Logger.error(`Error occurred while fetching glucose journals: ${error}`);
    return res.status(400).json({
      status: 'ERROR',
      message: `Error fetching glucose journals: ${error}`,
    });
  }
};
export const getGlucoseJournal = async (req: Request, res: Response) => {
  try {
    const glucoseJournalId = req.params.id;
    const glucoseJournal = await db.GlucoseMeasurement.findOne({
      where: {
        id: glucoseJournalId,
      },
    });

    if (!glucoseJournal) {
      return res.status(404).json({
        status: 'NOT_FOUND',
        message: 'Glucose Journal not found',
      });
    }

    return res.status(200).json({
      status: 'SUCCESS',
      data: glucoseJournal,
    });
  } catch (error) {
    Logger.error(`Error occurred while fetching glucose journal: ${error}`);
    return res.status(400).json({
      status: 'ERROR',
      message: `Error fetching glucose journal: ${error}`,
    });
  }
};
export const createGlucoseJournal = async (req: Request, res: Response) => {
  try {
    const user = await db.User.findOne({
      where: {
        uid: req.params.uid,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: 'NOT_FOUND',
        message: 'User not found',
      });
    }
    const { date, mealTime, bloodGlucose, unit, notes } = req.body;
    const glucoseJournal = await db.GlucoseMeasurement.create({
      uid: req.params.uid,
      date,
      mealTime,
      bloodGlucose,
      unit,
      notes,
    });
    return res.status(201).json({
      status: 'SUCCESS',
      data: glucoseJournal,
    });
  } catch (error) {
    Logger.error(`Error occurred while creating glucose journal: ${error}`);
    return res.status(400).json({
      status: 'ERROR',
      message: `Error creating glucose journal: ${error}`,
    });
  }
};
export const updateGlucoseJournal = async (req: Request, res: Response) => {
  try {
    const glucoseJournalId = req.params.id;
    const glucoseJournal = await db.GlucoseMeasurement.findOne({
      where: {
        id: glucoseJournalId,
      },
    });

    if (!glucoseJournal) {
      return res.status(404).json({
        status: 'NOT_FOUND',
        message: 'Glucose Journal not found',
      });
    }

    const { date, mealTime, bloodGlucose, unit, notes } = req.body;
    await db.GlucoseMeasurement.update(
      {
        date,
        mealTime,
        bloodGlucose,
        unit,
        notes,
      },
      {
        where: {
          id: glucoseJournalId,
        },
      }
    );

    const updatedGlucoseJournal = await db.GlucoseMeasurement.findOne({
      where: {
        id: glucoseJournalId,
      },
    });

    return res.status(200).json({
      status: 'SUCCESS',
      data: updatedGlucoseJournal,
    });
  } catch (error) {
    Logger.error(`Error occurred while updating glucose journal: ${error}`);
    return res.status(400).json({
      status: 'ERROR',
      message: `Error updating glucose journal: ${error}`,
    });
  }
};
export const deleteGlucoseJournal = async (req: Request, res: Response) => {
  try {
    const glucoseJournalId = req.params.id;
    const glucoseJournal = await db.GlucoseMeasurement.findOne({
      where: {
        id: glucoseJournalId,
      },
    });

    if (!glucoseJournal) {
      return res.status(404).json({
        status: 'NOT_FOUND',
        message: 'Glucose Journal not found',
      });
    }

    await db.GlucoseMeasurement.destroy({
      where: {
        id: glucoseJournalId,
      },
    });

    return res.status(200).json({
      status: 'SUCCESS',
      message: 'Glucose Journal deleted successfully',
    });
  } catch (error) {
    Logger.error(`Error occurred while deleting glucose journal: ${error}`);
    return res.status(400).json({
      status: 'ERROR',
      message: `Error deleting glucose journal: ${error}`,
    });
  }
};
