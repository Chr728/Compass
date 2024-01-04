import { Request, Response, NextFunction } from 'express';
import { Logger } from '../middlewares/logger';
import db from '../models';
import { moodJournalValidator } from '../utils/databaseValidators';
import { ErrorHandler } from '../middlewares/errorMiddleware';

export const getMoodJournals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await db.User.findOne({
      where: {
        uid: req.params.uid,
      },
    });

    if (!user) {
      throw new ErrorHandler(404, 'NOT_FOUND', 'User not found');
    }

    const moodJournals = await db.MoodJournal.findAll({
      where: {
        uid: req.params.uid,
      },
    });

    return res.status(200).json({
      status: 'SUCCESS',
      data: moodJournals,
    });
  } catch (error) {
    Logger.error(`Error occurred while fetching mood journals: ${error}`);
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(new ErrorHandler(400, 'ERROR', `Error fetching mood journals: ${error}`));
    }
  }
};

export const getMoodJournal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const moodJournalId = req.params.mood_journal_id;
    const moodJournal = await db.MoodJournal.findOne({
      where: {
        id: moodJournalId,
      },
    });

    if (!moodJournal) {
      throw new ErrorHandler(404, 'NOT_FOUND', 'Mood Journal not found');
    }

    return res.status(200).json({
      status: 'SUCCESS',
      data: moodJournal,
    });
  } catch (error) {
    Logger.error(`Error occurred while fetching mood journal: ${error}`);
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(new ErrorHandler(400, 'ERROR', `Error fetching mood journal: ${error}`));
    }
  }
};

export const createMoodJournal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await db.User.findOne({
      where: {
        uid: req.params.uid,
      },
    });

    if (!user) {
      throw new ErrorHandler(404, 'NOT_FOUND', 'User not found');
    }

    const { howAreYou, stressSignals, date, notes } = req.body;
    moodJournalValidator({ howAreYou, stressSignals, date, notes });

    const stressSignalsString = JSON.stringify(stressSignals);

    const moodJournal = await db.MoodJournal.create({
      uid: req.params.uid,
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
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(new ErrorHandler(400, 'ERROR', `Error creating mood journal: ${error}`));
    }
  }
};

export const updateMoodJournal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const moodJournalId = req.params.mood_journal_id;
    const moodJournal = await db.MoodJournal.findOne({
      where: {
        id: moodJournalId,
      },
    });

    if (!moodJournal) {
      throw new ErrorHandler(404, 'NOT_FOUND', 'Mood Journal not found');
    }

    const { howAreYou, stressSignals, date, notes } = req.body;
    moodJournalValidator({ howAreYou, stressSignals, date, notes });

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
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(new ErrorHandler(400, 'ERROR', `Error updating mood journal: ${error}`));
    }
  }
};

export const deleteMoodJournal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const moodJournalId = req.params.mood_journal_id;
    const moodJournal = await db.MoodJournal.findOne({
      where: {
        id: moodJournalId,
      },
    });

    if (!moodJournal) {
      throw new ErrorHandler(404, 'NOT_FOUND', 'Mood Journal not found');
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
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(new ErrorHandler(400, 'ERROR', `Error deleting mood journal: ${error}`));
    }
  }
};
