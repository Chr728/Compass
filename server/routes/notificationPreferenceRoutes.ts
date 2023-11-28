import { Router } from 'express';
import enforceAuthorization from '../middlewares/enforceAuthorization';
import {
  createNotificationPreference,
  getNotificationPreference,
  updateNotificationPreference,
  deleteNotificationPreference,
} from '../controllers/notificationPreferenceController';

const router = Router();

router
  .route('/:uid')
  .post(enforceAuthorization, createNotificationPreference)
  .get(enforceAuthorization, getNotificationPreference)
  .delete(enforceAuthorization, deleteNotificationPreference)
  .put(enforceAuthorization, updateNotificationPreference);

export default router;
