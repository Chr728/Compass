import { Request, Response, NextFunction } from 'express';
import { Logger } from '../middlewares/logger';
import db from '../models';
import { ErrorHandler } from '../middlewares/errorMiddleware';

export const getSnoringResults = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const getSnoringResult = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const createSnoringResult = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const deleteSnoringResult = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
