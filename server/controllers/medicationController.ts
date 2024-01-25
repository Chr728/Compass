import { Request, Response, NextFunction } from 'express';
import { Logger } from '../middlewares/logger';
import db from '../models';
import { medicationValidator } from '../utils/databaseValidators';
import { ErrorHandler } from '../middlewares/errorMiddleware';
const multer = require("multer");
const path = require("path")
const uuid = require("uuid")
import fs = require("fs")

export const createMedication = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.uid;
        const user = await db.User.findOne({
            where: {
                uid: userId
            }
        });

        if (!user) {
            throw new ErrorHandler(404, 'ERROR', 'User not found, invalid user uid.');
        }
        let medImagePath;
        const { medicationName, dateStarted, time, dosage, unit, frequency, route, notes } = req.body;
        medicationValidator(req.body);
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
        if (error instanceof ErrorHandler) {
            next(error);
        } else {
            next(new ErrorHandler(400, 'ERROR', `Error creating medication: ${error}`));
        }
    }
};

export const getMedications = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.uid;
        const user = await db.User.findOne({
            where: {
                uid: userId
            }
        });

        if (!user) {
            throw new ErrorHandler(404, 'ERROR', 'User not found, invalid user uid.');
        }

        const medications = await db.Medication.findAll({
            where: {
                uid: userId
            }
        });

        return res.status(200).json({
            status: 'SUCCESS',
            data: medications
        });
    } catch (error) {
        Logger.error(`Error occurred while fetching medications: ${error}`);
        if (error instanceof ErrorHandler) {
            next(error);
        } else {
            next(new ErrorHandler(400, 'ERROR', `Error fetching medications: ${error}`));
        }
    }
};

export const getMedication = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const medicationId = req.params.id;
        const medication = await db.Medication.findOne({
            where: {
                id: medicationId
            }
        });

        if (!medication) {
            throw new ErrorHandler(404, 'ERROR', 'Medication not found, invalid medication id.');
        }

        return res.status(200).json({
            status: 'SUCCESS',
            data: medication
        });
    } catch (error) {
        Logger.error(`Error occurred while fetching medication: ${error}`);
        if (error instanceof ErrorHandler) {
            next(error);
        } else {
            next(new ErrorHandler(400, 'ERROR', `Error fetching medication: ${error}`));
        }
    }
};

export const updateMedication = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const medicationId = req.params.id;
        const medication = await db.Medication.findOne({
            where: {
                id: medicationId
            }
        });

        if (!medication) {
            throw new ErrorHandler(404, 'ERROR', 'Medication not found, invalid medication id.');
        }

        const { medicationName, dateStarted, time, dosage, unit, frequency, route, notes } = req.body;
        medicationValidator(req.body);
        await db.Medication.update({
            medicationName,
            dateStarted,
            time,
            dosage,
            unit,
            frequency,
            route,
            notes,
        }, {
            where: {
                id: medicationId
            }
        });

        const updatedMedication = await db.Medication.findOne({
            where: {
                id: medicationId
            }
        });

        return res.status(200).json({
            status: 'SUCCESS',
            data: updatedMedication
        });
    } catch (error) {
        Logger.error(`Error occurred while updating medication: ${error}`);
        if (error instanceof ErrorHandler) {
            next(error);
        } else {
            next(new ErrorHandler(400, 'ERROR', `Error updating medication: ${error}`));
        }
    }
};

export const deleteMedication = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const medicationId = req.params.id;
        const medication = await db.Medication.findOne({
            where: {
                id: medicationId
            }
        });

        if (!medication) {
            throw new ErrorHandler(404, 'ERROR', 'Medication not found, invalid medication id.');
        }
        await db.Medication.destroy({
            where: {
                id: medicationId
            }
        });

        return res.status(200).json({
            status: 'SUCCESS',
            message: 'Medication entry deleted successfully',
        });
    } catch (error) {
        Logger.error(`Error occurred while deleting medication record: ${error}`);
        if (error instanceof ErrorHandler) {
            next(error);
        } else {
            next(new ErrorHandler(400, 'ERROR', `Error deleting medication record: ${error}`));
        }
    }
};

export const createImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const medicationId = req.params.id;
        const medication = await db.Medication.findOne({
            where: {
                id: medicationId
            }
        });

        if (!medication) {
            throw new ErrorHandler(404, 'ERROR', 'Medication not found, invalid medication id.');
        }

        let medImagePath;
        if (!(req as any).file){
            throw new ErrorHandler(404, 'ERROR', 'Please upload image');
        }
        else{
            medImagePath = (req as any).file.path
        }
        await db.Medication.update({
            image:medImagePath
        }, {
            where: {
                id: medicationId
            }
        });

        return res.status(200).json({
            message: "Medication image uploaded successfully"
        });
    } catch (error) {
        Logger.error(`Error occurred while updating medication: ${error}`);
        if (error instanceof ErrorHandler) {
            next(error);
        } else {
            next(new ErrorHandler(400, 'ERROR', `Error updating medication: ${error}`));
        }
    }
}

export const updateImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const medicationId = req.params.id;
        const medication = await db.Medication.findOne({
            where: {
                id: medicationId
            }
        });

        if (!medication) {
            throw new ErrorHandler(404, 'ERROR', 'Medication not found, invalid medication id.');
        }
        
        fs.unlink(medication.image, (error: any) => {
            if (error) {
                throw new ErrorHandler(404, 'ERROR', 'Old Medication Image not found');
            }
        })

        let medImagePath;
        if (!(req as any).file){
            throw new ErrorHandler(404, 'ERROR', 'Please upload image');
        }
        else{
            medImagePath = (req as any).file.path
        }
        await db.Medication.update({
            image:medImagePath
        }, {
            where: {
                id: medicationId
            }
        });

        return res.status(200).json({
            message: "Medication image uploaded successfully"
        });
    } catch (error) {
        Logger.error(`Error occurred while updating medication: ${error}`);
        if (error instanceof ErrorHandler) {
            next(error);
        } else {
            next(new ErrorHandler(400, 'ERROR', `Error updating medication: ${error}`));
        }
    }
}

//Storage function to store images in filesystem
const storage = multer.diskStorage({
    destination: (req:any,file:any,cb:any) => {
        cb(null, "./medicationImages")
    },
    filename: (req:any,file:any,cb:any) => {
        cb(null, req.params.id + "_" + path.basename(file.originalname));
    }
})

//Upload image function
export const upload = multer({
    storage: storage,
})
