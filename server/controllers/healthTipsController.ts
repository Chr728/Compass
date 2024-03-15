import { Request, Response, NextFunction } from 'express';
import { Logger } from '../middlewares/logger';
import db from '../models';
import { ErrorHandler } from '../middlewares/errorMiddleware';



// Retrieve the health tip report of the user
export const getHealthTip = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const uid = req.params.uid;
        const healthTip = await db.HealthTips.findOne({
            where: {
                uid: uid
            }
        });

        if (!getHealthTip) {
            throw new ErrorHandler(404, 'NOT_FOUND', 'Health Tip model not found for user');
        }

        return res.status(200).json({
            status: 'SUCCESS',
            data: healthTip
        });
    } catch (error) {
        Logger.error(`Error occurred while fetching health tip entry: ${error}`);
        if (error instanceof ErrorHandler) {
            next(error);
        } else {
            next(new ErrorHandler(400, 'ERROR', `Error fetching health tip entry: ${error}`));
        }
    }
};