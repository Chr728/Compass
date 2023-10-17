import { subscribeUserReminders } from "../controllers/reminderController";
import { Router } from "express";
const router = Router();

router.route("/:uid").post(subscribeUserReminders);

export default router;
