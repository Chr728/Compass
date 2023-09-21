import { Request, Response } from 'express';
import db from '../models';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await db.User.findAll()
        res.status(200).json({
            status: `SUCCESS`,
            data: users,
        });
    } catch (err) {
        res.status(400).json({
            status: `ERROR`,
            message: `Error getting users : ${err}`,
        });
    }
}

export const getUser = async (req: Request, res: Response) => {
    try {
        const user = await db.User.findByPk(req.params.id)

        if (!user) {
            return res.status(404).json({
                status: 'ERROR',
                message: `User not found.`,
            })
        }

        res.status(200).json({
            status: `SUCCESS`,
            data: user,
        })

    } catch (err) {
        res.status(400).json({
            status: `ERROR`,
            message: `Error getting user : ${err}`,
        })
    }
}

export const createUser = async (req: Request, res: Response) => {
    try {
        const {
            email,
            firstName,
            lastName,
            streetAddress,
            city,
            province,
            postalCode,
            phoneNumber,
            birthDate,
            sex
        } = req.body;

        const createdUser = await db.User.create({
            email,
            firstName,
            lastName,
            streetAddress,
            city,
            province,
            postalCode,
            phoneNumber,
            birthDate,
            sex
        })
        res.status(201).json({
            status: `SUCCESS`,
            data: createdUser,
        })
    } catch (err) {
        res.status(400).json({
            status: `ERROR`,
            message: `Error creating user record: ${err}`,
        })
    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const updatedUserData = req.body;
        const userId = req.params.id;
        const updatedUser = await db.User.update(updatedUserData, {
            where: {
                id: userId
            },
            returning: true
        })
        res.status(200).json({
            status: `SUCCESS`,
            data: updatedUser,
        })
    } catch (err) {
        res.status(400).json({
            status: 'ERROR',
            message: `Error updating user record: ${err}`
        })
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const deletedUser = await db.User.destroy({
            where: {
                id: userId
            }
        })

        if(!deletedUser) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'User not found.'
            });
        }

        res.status(200).json({
            status: `SUCCESS`,
            data: `Successfully deleted user.`,
        })
    } catch (err) {
        res.status(400).json({
            status: 'ERROR',
            message: `Error deleting user record: ${err}`
        })
    }
}


