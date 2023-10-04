import { Request, Response } from 'express';
import { Logger } from '../middlewares/logger';
import db from '../models';
import { speedDialValidator } from '../utils/databaseValidators';
export const createSpeedDial = async (req: Request, res: Response) => {
    try {
        const {uid,contactName, contactNumber} = req.body;
        speedDialValidator({contactName, contactNumber});
        const speedDial = await db.SpeedDial.create({
            uid,
            contactName,
            contactNumber
        });
        res.status(201).json({
            status: `SUCCESS`,
            data: speedDial,
        }
        );
        } catch (err) {
        Logger.error(`Error occurred while creating speed dial: ${err}`);
        res.status(400).json({
                status: `ERROR`,
                message: `Error creating speed dial: ${err}`,
            }
        );

    }
}

export const getSpeedDial = async (req: Request, res: Response) => {
    const {id,uid} = req.params;
    try {
        const speedDial = await db.SpeedDial.findOne({
            where: {
                uid,
                id
            }
        });
        if(!speedDial){
            return res.status(404).json({
                status: 'ERROR',
                message: `Speed dial not found.`,
            });
        }
        res.status(200).json({
            status: `SUCCESS`,
            data: speedDial,
        });
    }
    catch (err) {
        Logger.error(`Error occurred while fetching speed dial: ${err}`);
        res.status(400).json({
            status: `ERROR`,
            message: `Error getting speed dial : ${err}`,
        });
    }
}
export const getSpeedDials = async (req: Request, res: Response) => {
    const {uid} = req.params;
    try {
        const speedDials = await db.SpeedDial.findAll({
            where: {
                uid
            }
        });
        res.status(200).json({
            status: `SUCCESS`,
            data: speedDials,
        });
    }
    catch (err) {
        Logger.error(`Error occurred while fetching speed dials: ${err}`);
        res.status(400).json({
            status: `ERROR`,
            message: `Error getting speed dials : ${err}`,
        });
    }
}

export const updateSpeedDial = async (req: Request, res: Response) => {
    const {uid,id} = req.params;
    const {contactName, contactNumber} = req.body;
    try {
        speedDialValidator({contactName, contactNumber})
        const speedDial = await db.SpeedDial.findOne({
            where: {
                uid,
                id
            }
        });
        if(!speedDial){
            return res.status(404).json({
                status: 'ERROR',
                message: `Speed dial not found.`,
            });
        }
        await speedDial.update({
            contactName,
            contactNumber
        });
        res.status(200).json({
            status: `SUCCESS`,
            data: speedDial,
        });
    }
    catch (err) {
        Logger.error(`Error occurred while updating speed dial: ${err}`);
        res.status(400).json({
            status: `ERROR`,
            message: `Error updating speed dial : ${err}`,
        });
    }

}

export const deleteSpeedDial = async (req: Request, res: Response) => {
    const {uid,id} = req.params;
    try {
        const speedDial = await db.SpeedDial.findOne({
            where: {
                uid,
                id
            }
        });
        if(!speedDial){
            return res.status(404).json({
                status: 'ERROR',
                message: `Speed dial not found.`,
            });
        }
        await speedDial.destroy();
        res.status(204).json({
            status: `SUCCESS`,
            message: `Successfully deleted speed dial.`,
        });
    }
    catch (err) {
        Logger.error(`Error occurred while deleting speed dial: ${err}`);
        res.status(400).json({
            status: `ERROR`,
            message: `Error deleting speed dial : ${err}`,
        });
    }
}