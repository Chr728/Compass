import { Request, Response } from 'express';
import { Logger } from '../middlewares/logger';
import db from '../models';
import { userValidator } from '../utils/databaseValidators';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await db.User.findAll();
    res.status(200).json({
      status: `SUCCESS`,
      data: users,
    });
  } catch (err) {
    Logger.error(`Error occurred while fetching users: ${err}`);
    res.status(400).json({
      status: `ERROR`,
      message: `Error getting users : ${err}`,
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await db.User.findOne({
      where: {
        uid: req.params.uid,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: 'ERROR',
        message: `User not found.`,
      });
    }

    res.status(200).json({
      status: `SUCCESS`,
      data: user,
    });
  } catch (err) {
    Logger.error(`Error occurred while fetching user: ${err}`);
    res.status(400).json({
      status: `ERROR`,
      message: `Error getting user : ${err}`,
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { uid, email, firstName, lastName, phoneNumber, birthDate, sex } =
      req.body;
    userValidator(req.body);
    const createdUser = await db.User.create({
      uid,
      email,
      firstName,
      lastName,
      phoneNumber,
      birthDate,
      sex,
    });
    res.status(201).json({
      status: `SUCCESS`,
      data: createdUser,
    });
  } catch (err) {
    Logger.error(`Error occurred while creating user: ${err}`);
    res.status(400).json({
      status: `ERROR`,
      message: `Error creating user record: ${err}`,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const updatedUserData = req.body;
    const userId = req.params.uid;
    const updatedUser = await db.User.update(updatedUserData, {
      where: {
        uid: userId,
      },
      returning: true,
      plain: true,
    });
    res.status(200).json({
      status: `SUCCESS`,
      data: updatedUser,
    });
  } catch (err) {
    Logger.error(`Error occurred while updating user: ${err}`);
    res.status(400).json({
      status: 'ERROR',
      message: `Error updating user record: ${err}`,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.uid;
    const deletedUser = await db.User.destroy({
      where: {
        id: userId,
      },
    });

    if (!deletedUser) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'User not found.',
      });
    }

    res.status(200).json({
      status: `SUCCESS`,
      data: `Successfully deleted user.`,
    });
  } catch (err) {
    Logger.error(`Error occurred while deleting user: ${err}`);
    res.status(400).json({
      status: 'ERROR',
      message: `Error deleting user record: ${err}`,
    });
  }
};
