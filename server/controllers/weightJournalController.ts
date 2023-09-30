import { Request, Response } from 'express';
import { Logger } from '../middlewares/logger';
import db from '../models';

export const getWeightJournals = async (req: Request, res: Response) => {};

export const getWeightJournal = async (req: Request, res: Response) => {};

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

export const updateWeightJournal = async (req: Request, res: Response) => {};

export const deleteWeightJournal = async (req: Request, res: Response) => {};
