import { Router } from "express";
import {
  createNotificationPreference,
  getNotificationPreference,
  updateNotificationPreference,
  deleteNotificationPreference,
} from "../controllers/notificationPreferenceController";

const router = Router();

router.route("/user/:id").post(createNotificationPreference);

router
  .route("/:uid")
  .get(getNotificationPreference)
  .delete(deleteNotificationPreference)
  .put(updateNotificationPreference);

export default router;
