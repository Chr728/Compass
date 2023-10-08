import { Request, Response } from 'express';
import { Logger } from '../middlewares/logger';
import db from '../models';

export const getMoodJournals = async (req: Request, res: Response) => {
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

    const moodJournals = await db.MoodJournal.findAll({
      where: {
        uid: req.params.user_id,
      },
    });

    return res.status(200).json({
      status: 'SUCCESS',
      data: moodJournals,
    });
  } catch (error) {
    Logger.error(`Error occurred while fetching mood journals: ${error}`);
    return res.status(400).json({
      status: 'ERROR',
      message: `Error fetching mood journals: ${error}`,
    });
  }
};

export const getMoodJournal = async (req: Request, res: Response) => {
  try {
    const moodJournalId = req.params.mood_journal_id;
    const moodJournal = await db.MoodJournal.findOne({
      where: {
        id: moodJournalId,
      },
    });

    if (!moodJournal) {
      return res.status(404).json({
        status: 'NOT_FOUND',
        message: 'Mood Journal not found',
      });
    }

    return res.status(200).json({
      status: 'SUCCESS',
      data: moodJournal,
    });
  } catch (error) {
    Logger.error(`Error occurred while fetching mood journal: ${error}`);
    return res.status(400).json({
      status: 'ERROR',
      message: `Error fetching mood journal: ${error}`,
    });
  }
};

export const createMoodJournal = async (req: Request, res: Response) => {
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

    const { howAreYou, stressSignals, date, notes } = req.body;

    const stressSignalsString = JSON.stringify(stressSignals);

    const moodJournal = await db.MoodJournal.create({
      uid: req.params.user_id,
      howAreYou,
      stressSignals: stressSignalsString,
      date,
      notes,
    });

    return res.status(201).json({
      status: 'SUCCESS',
      data: moodJournal,
    });
  } catch (error) {
    Logger.error(`Error occurred while creating mood journal: ${error}`);
    return res.status(400).json({
      status: 'ERROR',
      message: `Error creating mood journal: ${error}`,
    });
  }
};

export const updateMoodJournal = async (req: Request, res: Response) => {
  try {
    const moodJournalId = req.params.mood_journal_id;
    const moodJournal = await db.MoodJournal.findOne({
      where: {
        id: moodJournalId,
      },
    });

    if (!moodJournal) {
      return res.status(404).json({
        status: 'NOT_FOUND',
        message: 'Mood Journal not found',
      });
    }

    const { howAreYou, stressSignals, date, notes } = req.body;

    const stressSignalsString = JSON.stringify(stressSignals);

    await db.MoodJournal.update(
      {
        howAreYou,
        stressSignals: stressSignalsString,
        date,
        notes,
      },
      {
        where: {
          id: moodJournalId,
        },
      }
    );

    return res.status(200).json({
      status: 'SUCCESS',
      data: await db.MoodJournal.findOne({
        where: {
          id: moodJournalId,
        },
      }),
    });
  } catch (error) {
    Logger.error(`Error occurred while updating mood journal: ${error}`);
    return res.status(400).json({
      status: 'ERROR',
      message: `Error updating mood journal: ${error}`,
    });
  }
};

export const deleteMoodJournal = async (req: Request, res: Response) => {
  try {
    const moodJournalId = req.params.mood_journal_id;
    const moodJournal = await db.MoodJournal.findOne({
      where: {
        id: moodJournalId,
      },
    });

    if (!moodJournal) {
      return res.status(404).json({
        status: 'NOT_FOUND',
        message: 'Mood Journal not found',
      });
    }

    await db.MoodJournal.destroy({
      where: {
        id: moodJournalId,
      },
    });

    return res.status(200).json({
      status: 'SUCCESS',
      message: 'Mood Journal deleted successfully',
    });
  } catch (error) {
    Logger.error(`Error occurred while deleting mood journal: ${error}`);
    return res.status(400).json({
      status: 'ERROR',
      message: `Error deleting mood journal: ${error}`,
    });
  }
};
