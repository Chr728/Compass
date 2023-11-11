import { Request, Response } from "express";
import { Logger } from "../middlewares/logger";
import db from "../models";

export const createMedication = async (req: Request,res: Response) => {
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

        const { medicationName, dateStarted, time, dosage, unit, frequency, route, notes } = req.body;
        const medication = await db.Medication.create({
            uid: userId,
            medicationName,
            dateStarted,
            time,
            dosage,
            unit,
            frequency,
            route,
            notes,
        });

        return res.status(201).json({
            status: 'SUCCESS',
            data: medication
        });
    } catch (error) {
            Logger.error(`Error occurred while creating medication: ${error}`);
                return res.status(400).json({
                status: 'ERROR',
                message: `Error creating medication: ${error}`,
            });
        }
};

export const getMedications = async (req: Request,res: Response) => {
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

        const medication = await db.Medication.findAll({
            where: {
                uid: userId
            }
        });

        return res.status(200).json({
            status: 'SUCCESS',
            data: medication
        });
    } catch (error) {
        Logger.error(`Error occurred while fetching medications: ${error}`);
        return res.status(400).json({
            status: 'ERROR',
            message: `Error fetching medications: ${error}`,
        });
    }
};

export const getMedication = async (req: Request,res: Response) => {
    try{
        const medicationId = req.params.id;
        const medication = await db.Medication.findOne({
            where: {
                id: medicationId
            }
        });

        if(!medication) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'medication not found, invalid medication id.',
              });
        }

        return res.status(200).json({
            status: 'SUCCESS',
            data: medication
        });
    } catch (error) {
        Logger.error(`Error occurred while fetching medication: ${error}`);
        return res.status(400).json({
            status: 'ERROR',
            message: `Error fetching medication: ${error}`,
        });
    }
};

export const updateMedication = async (req: Request,res: Response) => {
};

export const deleteMedication = async (req: Request,res: Response) => {
};