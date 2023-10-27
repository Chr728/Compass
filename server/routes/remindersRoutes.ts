import { sendUserReminders } from "../controllers/reminderController";
import { Router } from "express";
const router = Router();

router.route("/:uid").post(sendUserReminders);

export default router;
