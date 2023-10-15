import { Request, Response } from "express";
import { Logger } from "../middlewares/logger";
import db from "../models";

// Create one food intake Journal for a user
export const createFoodIntakeJournal = async (req: Request,res: Response) => {
    try {
        const userId = req.params.uid;
        const user = await db.User.findOne({
            where: {
                uid: userId
            }
        });

        if(!user) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'User not found, invalid user uid.',
              });
        }

        const { date, time, foodName, mealType, servingNumber, notes } = req.body;
        const foodIntakeJournal = await db.FoodIntakeJournal.create({
            uid: userId,
            date,
            time,
            foodName,
            mealType,
            servingNumber,
            notes
        });

        return res.status(201).json({
            status: 'SUCCESS',
            data: foodIntakeJournal
        });
    } catch (error) {
            Logger.error(`Error occurred while creating food intake journal: ${error}`);
                return res.status(400).json({
                status: 'ERROR',
                message: `Error creating food intake journal: ${error}`,
            });
        }
};

// Retrieve all food intake Journals for a user
export const getFoodIntakeJournals = async (req: Request,res: Response) => {
    try{
        const userId = req.params.uid;
        const user = await db.User.findOne({
            where: {
                uid: userId
            }
        });

        if(!user) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'User not found, invalid user uid.',
              });
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
        return res.status(400).json({
            status: 'ERROR',
            message: `Error fetching food intake journals: ${error}`,
        });
    }
};

// Retrieve one specific food intake Journal for a user
export const getFoodIntakeJournal = async (req: Request,res: Response
) => {
    try{
        const journalId = req.params.id;
        const foodIntakeJournal = await db.FoodIntakeJournal.findOne({
            where: {
                id: journalId
            }
        });

        if(!foodIntakeJournal) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Food intake journal not found, invalid journal id.',
              });
        }

        return res.status(200).json({
            status: 'SUCCESS',
            data: foodIntakeJournal
        });
    } catch (error) {
        Logger.error(`Error occurred while fetching food intake journals: ${error}`);
        return res.status(400).json({
            status: 'ERROR',
            message: `Error fetching food intake journals: ${error}`,
        });
    }
};

// Update one food intake Journal of a user
export const updateFoodIntakeJournal = async (
    req: Request,
    res: Response
) => {
    try {
        const journalId = req.params.id;
        const foodIntakeJournal = await db.FoodIntakeJournal.findOne({
            where: {
                id: journalId
            }
        });

        if(!foodIntakeJournal) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Food intake journal not found, invalid journal id.',
            });
        }

        const { date, time, foodName, mealType, servingNumber, notes } = req.body;

        await db.FoodIntakeJournal.update({
            date,
            time,
            foodName,
            mealType,
            servingNumber,
            notes
        }, {
            where: {
                id: journalId
            }
        })

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
        Logger.error(`Error occurred while updating food intake journals: ${error}`);
        return res.status(400).json({
            status: 'ERROR',
            message: `Error updating food intake journals: ${error}`,
        });
    }

};

// Delete one food intake Journal of a user
export const deleteFoodIntakeJournal = async (
    req: Request,
    res: Response
) => {
    try {
        const journalId = req.params.id;
        const foodIntakeJournal = await db.FoodIntakeJournal.findOne({
            where: {
                id: journalId
            }
        });

        if (!foodIntakeJournal) {
            return res.status(404).json({
                status: 'NOT_FOUND',
                message: 'Food journal entry not found',
            });
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
        Logger.error(`Error occurred while deleting food intake journals: ${error}`);
        return res.status(400).json({
            status: 'ERROR',
            message: `Error deleting food intake journals: ${error}`,
        });
    }
};
