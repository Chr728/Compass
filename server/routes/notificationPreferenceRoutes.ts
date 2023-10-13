import { Router } from "express";
import {
  createNotificationPreference,
  getNotificationPreference,
  updateNotificationPreference,
} from "../controllers/notificationPreferenceController";

const router = Router();

router.route("/notifications").post(createNotificationPreference);

router
  .route("/notifications/:uid")
  .get(getNotificationPreference)
  .put(updateNotificationPreference);

export default router;
