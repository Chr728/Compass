import { getUserReminders } from "../controllers/reminderController";
import { Router } from "express";
const router = Router();

router.route("/:uid").get(getUserReminders);

export default router;
