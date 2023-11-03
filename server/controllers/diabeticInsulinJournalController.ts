import { Request, Response } from 'express';
import { Logger } from '../middlewares/logger';
import db from '../models';

export const getInsulinJournals = async (req: Request, res: Response) => {
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
    return res.status(400).json({
      status: 'ERROR',
      message: `Error fetching insulin journals: ${error}`,
    });
  }
};
export const getInsulinJournal = async (req: Request, res: Response) => {
  try {
    const insulinJournalId = req.params.id;
    const insulinJournal = await db.InsulinDosage.findOne({
      where: {
        id: insulinJournalId,
      },
    });
    if (!insulinJournal) {
      return res.status(404).json({
        status: 'NOT_FOUND',
        message: 'Insulin Journal not found',
      });
    }
    return res.status(200).json({
      status: 'SUCCESS',
      data: insulinJournal,
    });
  } catch (error) {
    Logger.error(`Error occurred while fetching insulin journal: ${error}`);
    return res.status(400).json({
      status: 'ERROR',
      message: `Error fetching insulin journal: ${error}`,
    });
  }
};
export const createInsulinJournal = async (req: Request, res: Response) => {
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
    const { date, time, typeOfInsulin, unit, bodySite, notes } = req.body;
    const insulinJournal = await db.InsulinDosage.create({
      uid: req.params.uid,
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
    return res.status(400).json({
      status: 'ERROR',
      message: `Error creating insulin journal: ${error}`,
    });
  }
};
export const updateInsulinJournal = async (req: Request, res: Response) => {
  try {
    const insulinJournalId = req.params.id;
    const insulinJournal = await db.InsulinDosage.findOne({
      where: {
        id: insulinJournalId,
      },
    });
    if (!insulinJournal) {
      return res.status(404).json({
        status: 'NOT_FOUND',
        message: 'Insulin Journal not found',
      });
    }
    const { date, time, typeOfInsulin, unit, bodySite, notes } = req.body;
    await db.InsulinDosage.update(
      {
        date,
        time,
        typeOfInsulin,
        unit,
        bodySite,
        notes,
      },
      {
        where: {
          id: insulinJournalId,
        },
      }
    );
    const updatedInsulinJournal = await db.InsulinDosage.findOne({
      where: {
        id: insulinJournalId,
      },
    });
    return res.status(200).json({
      status: 'SUCCESS',
      data: updatedInsulinJournal,
    });
  } catch (error) {
    Logger.error(`Error occurred while updating insulin journal: ${error}`);
    return res.status(400).json({
      status: 'ERROR',
      message: `Error updating insulin journal: ${error}`,
    });
  }
};
export const deleteInsulinJournal = async (req: Request, res: Response) => {
  try {
    const insulinJournalId = req.params.id;
    const insulinJournal = await db.InsulinDosage.findOne({
      where: {
        id: insulinJournalId,
      },
    });
    if (!insulinJournal) {
      return res.status(404).json({
        status: 'NOT_FOUND',
        message: 'Insulin Journal not found',
      });
    }
    await db.InsulinDosage.destroy({
      where: {
        id: insulinJournalId,
      },
    });
    return res.status(200).json({
      status: 'SUCCESS',
      message: 'Insulin Journal deleted successfully',
    });
  } catch (error) {
    Logger.error(`Error occurred while deleting insulin journal: ${error}`);
    return res.status(400).json({
      status: 'ERROR',
      message: `Error deleting insulin journal: ${error}`,
    });
  }
};
