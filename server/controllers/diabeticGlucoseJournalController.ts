import { Request, Response } from 'express';
import { Logger } from '../middlewares/logger';
import db from '../models';

export const getGlucoseJournals = async (req: Request, res: Response) => {};
export const getGlucoseJournal = async (req: Request, res: Response) => {};
export const createGlucoseJournal = async (req: Request, res: Response) => {
  try {
    const user = await db.User.findOne({
      where: {
        uid: req.params.user_id,
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
      uid: req.params.user_id,
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
export const updateGlucoseJournal = async (req: Request, res: Response) => {};
export const deleteGlucoseJournal = async (req: Request, res: Response) => {};
