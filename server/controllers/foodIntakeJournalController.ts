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
};

// Delete one food intake Journal of a user
export const deleteFoodIntakeJournal = async (
    req: Request,
    res: Response
) => {
};