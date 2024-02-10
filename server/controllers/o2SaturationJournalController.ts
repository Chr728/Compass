import { Request, Response, NextFunction } from 'express';
import { Logger } from '../middlewares/logger';
import db from '../models';
import { diabeticInsulinJournalValidator } from '../utils/databaseValidators';
import { ErrorHandler } from '../middlewares/errorMiddleware';

export const getO2SaturationJournals = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const getO2SaturationJournal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const createO2SaturationJournal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const updateO2SaturationJournal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const deleteO2SaturationJournal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
