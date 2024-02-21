import { Request, Response, NextFunction } from 'express';
import { Logger } from '../middlewares/logger';
import db from '../models';
import { foodIntakeJournalValidator } from '../utils/databaseValidators';
import { ErrorHandler } from '../middlewares/errorMiddleware';

// Create one food intake Journal for a user
export const createFoodIntakeJournal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.uid;
        const user = await db.User.findOne({
            where: {
                uid: userId
            }
        });

        if (!user) {
            throw new ErrorHandler(404, 'NOT_FOUND', 'User not found, invalid user uid.');
        }

        const { date, time, foodName, mealType, servingNumber, notes, calorie } = req.body;
        foodIntakeJournalValidator(req.body);
        const foodIntakeJournal = await db.FoodIntakeJournal.create({
            uid: userId,
            date,
            time,
            foodName,
            mealType,
            servingNumber,
            notes,
            calorie
        });

        return res.status(201).json({
            status: 'SUCCESS',
            data: foodIntakeJournal
        });
    } catch (error) {
        Logger.error(`Error occurred while creating food intake journal: ${error}`);
        if (error instanceof ErrorHandler) {
            next(error);
        } else {
            next(new ErrorHandler(400, 'ERROR', `Error creating food intake journal: ${error}`));
        }
    }
};

// Retrieve all food intake Journals for a user
export const getFoodIntakeJournals = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.uid;
        const user = await db.User.findOne({
            where: {
                uid: userId
            }
        });

        if (!user) {
            throw new ErrorHandler(404, 'NOT_FOUND', 'User not found, invalid user uid.');
        }

        const foodIntakeJournals = await db.FoodIntakeJournal.findAll({
            where: {
                uid: userId
            }
        });

        return res.status(200).json({
            status: 'SUCCESS',
            data: foodIntakeJournals
        });
    } catch (error) {
        Logger.error(`Error occurred while fetching food intake journals: ${error}`);
        if (error instanceof ErrorHandler) {
            next(error);
        } else {
            next(new ErrorHandler(400, 'ERROR', `Error fetching food intake journals: ${error}`));
        }
    }
};

// Retrieve one specific food intake Journal for a user
export const getFoodIntakeJournal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const journalId = req.params.id;
        const foodIntakeJournal = await db.FoodIntakeJournal.findOne({
            where: {
                id: journalId
            }
        });

        if (!foodIntakeJournal) {
            throw new ErrorHandler(404, 'NOT_FOUND', 'Food intake journal not found, invalid journal id.');
        }

        return res.status(200).json({
            status: 'SUCCESS',
            data: foodIntakeJournal
        });
    } catch (error) {
        Logger.error(`Error occurred while fetching food intake journal: ${error}`);
        if (error instanceof ErrorHandler) {
            next(error);
        } else {
            next(new ErrorHandler(400, 'ERROR', `Error fetching food intake journal: ${error}`));
        }
    }
};

// Update one food intake Journal of a user
export const updateFoodIntakeJournal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const journalId = req.params.id;
        const foodIntakeJournal = await db.FoodIntakeJournal.findOne({
            where: {
                id: journalId
            }
        });

        if (!foodIntakeJournal) {
            throw new ErrorHandler(404, 'NOT_FOUND', 'Food intake journal not found, invalid journal id.');
        }

        const { date, time, foodName, mealType, servingNumber, notes, calorie } = req.body;
        foodIntakeJournalValidator(req.body);

        await db.FoodIntakeJournal.update({
            date,
            time,
            foodName,
            mealType,
            servingNumber,
            notes,
            calorie
        }, {
            where: {
                id: journalId
            }
        });

        const updatedFoodIntakeJournal = await db.FoodIntakeJournal.findOne({
            where: {
                id: journalId
            }
        });

        return res.status(200).json({
            status: 'SUCCESS',
            data: updatedFoodIntakeJournal
        });
    } catch (error) {
        Logger.error(`Error occurred while updating food intake journal: ${error}`);
        if (error instanceof ErrorHandler) {
            next(error);
        } else {
            next(new ErrorHandler(400, 'ERROR', `Error updating food intake journal: ${error}`));
        }
    }
};

// Delete one food intake Journal of a user
export const deleteFoodIntakeJournal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const journalId = req.params.id;
        const foodIntakeJournal = await db.FoodIntakeJournal.findOne({
            where: {
                id: journalId
            }
        });

        if (!foodIntakeJournal) {
            throw new ErrorHandler(404, 'NOT_FOUND', 'Food journal entry not found');
        }

        await db.FoodIntakeJournal.destroy({
            where: {
                id: journalId
            }
        });

        return res.status(200).json({
            status: 'SUCCESS',
            message: 'Food journal entry deleted successfully',
        });
    } catch (error) {
        Logger.error(`Error occurred while deleting food intake journal: ${error}`);
        if (error instanceof ErrorHandler) {
            next(error);
        } else {
            next(new ErrorHandler(400, 'ERROR', `Error deleting food intake journal: ${error}`));
        }
    }
};
