import { Request, Response, NextFunction } from 'express';
import { Logger } from '../middlewares/logger';
import db from '../models';
import { ErrorHandler } from '../middlewares/errorMiddleware';

export const getSnoringResults = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await db.User.findOne({
      where: {
        uid: req.params.uid,
      },
    });

    if (!user) {
      throw new ErrorHandler(404, 'NOT_FOUND', 'User not found');
    }

    const snoringResults = await db.SnoringResult.findAll({
      where: {
        uid: req.params.uid,
      },
    });

    return res.status(200).json({
      status: 'SUCCESS',
      data: snoringResults,
    });
  } catch (error) {
    Logger.error(`Error occurred while fetching snoring results: ${error}`);
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(
        new ErrorHandler(
          400,
          'ERROR',
          `Error fetching snoring results: ${error}`
        )
      );
    }
  }
};

export const getSnoringResult = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const snoringResultId = req.params.id;
    const snoringResult = await db.SnoringResult.findOne({
      where: {
        id: snoringResultId,
      },
    });

    if (!snoringResult) {
      throw new ErrorHandler(404, 'NOT_FOUND', 'Snoring result not found');
    }

    return res.status(200).json({
      status: 'SUCCESS',
      data: snoringResult,
    });
  } catch (error) {
    Logger.error(`Error occurred while fetching snoring result: ${error}`);
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(
        new ErrorHandler(
          400,
          'ERROR',
          `Error fetching snoring result: ${error}`
        )
      );
    }
  }
};

export const createSnoringResult = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await db.User.findOne({
      where: {
        uid: req.params.uid,
      },
    });

    if (!user) {
      throw new ErrorHandler(404, 'NOT_FOUND', 'User not found');
    }

    const { date, filename, result } = req.body;
    const snoringResult = await db.SnoringResult.create({
      uid: req.params.uid,
      date,
      filename,
      result,
    });

    return res.status(201).json({
      status: 'SUCCESS',
      data: snoringResult,
    });
  } catch (error) {
    Logger.error(`Error occurred while creating snoring result: ${error}`);
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(
        new ErrorHandler(
          400,
          'ERROR',
          `Error creating snoring result: ${error}`
        )
      );
    }
  }
};

export const deleteSnoringResult = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const snoringResultId = req.params.id;
    const snoringResult = await db.SnoringResult.findOne({
      where: {
        id: snoringResultId,
      },
    });

    if (!snoringResult) {
      throw new ErrorHandler(404, 'NOT_FOUND', 'Snoring result not found');
    }

    await db.SnoringResult.destroy({
      where: { id: snoringResultId },
    });

    return res.status(200).json({
      status: 'SUCCESS',
      message: 'Snoring result deleted successfully',
    });
  } catch (error) {
    Logger.error(`Error occurred while deleting snoring result: ${error}`);
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(
        new ErrorHandler(
          400,
          'ERROR',
          `Error deleting snoring result: ${error}`
        )
      );
    }
  }
};
