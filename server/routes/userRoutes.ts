import { Router } from "express";
import {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} from "../controllers/userController";

const router = Router();

router
    .route('/')
    .get(getUsers)
    .post(createUser)

router.
    route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser)

export default router;
