import { Request, Response, NextFunction } from "express";
import { Logger } from "../middlewares/logger";
import db from "../models";
import { ErrorHandler } from '../middlewares/errorMiddleware';

export const createSubscription = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.uid;
        const user = await db.User.findOne({ where: { uid: userId } });

        if (!user) {
            throw new ErrorHandler(404, 'ERROR', 'User not found, invalid user uid.');
        }

        const getSubscription = await db.Subscription.findOne({ where: { uid: userId } });

        if (getSubscription) {
            throw new ErrorHandler(400, 'ERROR', 'The user already has one subscription, please update instead!');
        }

        const { subscription } = req.body;
        const createSubscription = await db.Subscription.create({ uid: userId, subscription });

        return res.status(201).json({ status: 'SUCCESS', data: createSubscription });
    } catch (error) {
        Logger.error(`Error occurred while creating subscription: ${error}`);
        if (error instanceof ErrorHandler) {
            next(error);
        } else {
            next(new ErrorHandler(400, 'ERROR', `Error creating subscription: ${error}`));
        }
    }
};

export const getSubscription = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.uid;
        const user = await db.User.findOne({ where: { uid: userId } });

        if (!user) {
            throw new ErrorHandler(404, 'ERROR', 'User not found, invalid user uid.');
        }

        const getSubscription = await db.Subscription.findOne({ where: { uid: userId } });

        if (!getSubscription) {
            throw new ErrorHandler(404, 'ERROR', 'No subscription exist for this user, please create.');
        }

        return res.status(200).json({ status: 'SUCCESS', data: getSubscription });
    } catch (error) {
        Logger.error(`Error occurred while fetching subscription: ${error}`);
        if (error instanceof ErrorHandler) {
            next(error);
        } else {
            next(new ErrorHandler(400, 'ERROR', `Error fetching subscription: ${error}`));
        }
    }
};

export const updateSubscription = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.uid;
        const user = await db.User.findOne({ where: { uid: userId } });

        if (!user) {
            throw new ErrorHandler(404, 'ERROR', 'User not found, invalid user uid.');
        }

        const getSubscription = await db.Subscription.findOne({ where: { uid: userId } });

        if (!getSubscription) {
            throw new ErrorHandler(404, 'ERROR', 'No subscription exist for this user.');
        }

        const { subscription } = req.body;
        await db.Subscription.update({ subscription }, { where: { uid: userId } });

        const getUpdatedSubscription = await db.Subscription.findOne({ where: { uid: userId } });

        res.status(200).json({ status: `SUCCESS`, data: getUpdatedSubscription });
    } catch (error) {
        Logger.error(`Error occurred while updating subscription: ${error}`);
        if (error instanceof ErrorHandler) {
            next(error);
        } else {
            next(new ErrorHandler(400, 'ERROR', `Error updating subscription record: ${error}`));
        }
    }
};

export const deleteSubscription = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.uid;
        const user = await db.User.findOne({ where: { uid: userId } });

        if (!user) {
            throw new ErrorHandler(404, 'ERROR', 'User not found, invalid user uid.');
        }

        const getSubscription = await db.Subscription.findOne({ where: { uid: userId } });

        if (!getSubscription) {
            throw new ErrorHandler(404, 'ERROR', 'No subscription exist for this user.');
        }

        await db.Subscription.destroy({ where: { uid: userId } });

        res.status(200).json({ status: `SUCCESS`, message: `Successfully deleted subscription.` });
    } catch (error) {
        Logger.error(`Error occurred while deleting subscription: ${error}`);
        if (error instanceof ErrorHandler) {
            next(error);
        } else {
            next(new ErrorHandler(400, 'ERROR', `Error deleting subscription: ${error}`));
        }
    }
};
