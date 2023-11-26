import { Request, Response } from "express";
import { Logger } from "../middlewares/logger";
import db from "../models";

export const getActivityJournals = async (req: Request, res: Response) => {
    try{
        const user = await db.User.findOne({
            where: {
                uid: req.params.uid
            }
        });

        if(!user) {
            return res.status(404).json({
                status: "NOT_FOUND",
                message: "User not found"
            });
        }

        const activityJournals = await db.ActivityJournal.findAll({
            where: {
                uid: req.params.uid
            }
        });

        return res.status(200).json({
            status: "SUCCESS",
            data: activityJournals
        });

    } catch (error) {
        Logger.error(`Error occurred while fetching activity journals: ${error}`);
        return res.status(400).json({
            status: 'ERROR',
            message: `Error fetching activity journals: ${error}`,
        });
    }
}

export const getActivityJournal = async (req: Request, res: Response) => {
    try {
        const activityJournalId = req.params.activity_journal_id;
        const activityJournal = await db.ActivityJournal.findOne({
            where: {
                id: activityJournalId
            }
        });

        if(!activityJournal) {
            return res.status(404).json({
                status: "NOT_FOUND",
                message: "Activity Journal not found"
            });
        }

        return res.status(200).json({
            status: "SUCCESS",
            data: activityJournal
        });

    } catch (error) {
        Logger.error(`Error occurred while fetching activity journal: ${error}`);
        return res.status(400).json({
            status: 'ERROR',
            message: `Error fetching activity journal: ${error}`,
        });
    }
}

export const createActivityJournal = async (req: Request, res: Response) => {
    try {
        const user = await db.User.findOne({
            where: {
                uid: req.params.uid
            }
        });

        if(!user) {
            return res.status(404).json({
                status: "NOT_FOUND",
                message: "User not found"
            });
        }

        const { date, time, activity, duration, notes } = req.body;

        const activityJournal = await db.ActivityJournal.create({
            uid: req.params.uid,
            date,
            time,
            activity,
            duration,
            notes
        });

        return res.status(201).json({
            status: "SUCCESS",
            data: activityJournal
        });

        } catch (error) {
            Logger.error(`Error occurred while creating activity journal: ${error}`);
                return res.status(400).json({
                status: 'ERROR',
                message: `Error creating activity journal: ${error}`,
            });
        }
    }

export const updateActivityJournal = async (req: Request, res: Response) => {
    try {
        const activityJournalId = req.params.activity_journal_id;
        const activityJournal = await db.ActivityJournal.findOne({
            where: {
                id: activityJournalId
            }
        });

        if(!activityJournal) {
            return res.status(404).json({
                status: "NOT_FOUND",
                message: "Activity Journal not found"
            });
        }

        const { date, time, activity, duration, notes } = req.body;

        await db.ActivityJournal.update({
            date,
            time,
            activity,
            duration,
            notes
        } , {
            where: {
                id: activityJournalId
            }
        });

        const updatedActivityJournal = await db.ActivityJournal.findOne({
            where: {
                id: activityJournalId
            }
        });

        return res.status(200).json({
            status: "SUCCESS",
            data: updatedActivityJournal
        });

    } catch (error) {
        Logger.error(`Error occurred while updating activity journal: ${error}`);
        return res.status(400).json({
            status: 'ERROR',
            message: `Error updating activity journal: ${error}`,
        });
    }
}

export const deleteActivityJournal = async (req: Request, res: Response) => {
    try {
        const activityJournalId = req.params.activity_journal_id;
        const existingActivityJournal = await db.ActivityJournal.findOne({
            where: {
                id: activityJournalId,
            },
        });

        if (!existingActivityJournal) {
            return res.status(404).json({
                status: 'NOT_FOUND',
                message: 'Activity journal entry not found',
            });
        }

        await db.ActivityJournal.destroy({
            where: {
                id: activityJournalId,
            },
        } as any);

        return res.status(200).json({
            status: 'SUCCESS',
            message: 'Activity journal entry deleted successfully',
        });

    } catch (error) {
        Logger.error(`Error occurred while deleting activity journal: ${error}`);
        return res.status(400).json({
            status: 'ERROR',
            message: `Error deleting activity journal: ${error}`,
        });
    }
}
