import { sendUserReminders } from '../controllers/reminderController';
import enforceAuthorization from '../middlewares/enforceAuthorization';
import { Router } from 'express';
const router = Router();

router.route('/:uid').post(enforceAuthorization, sendUserReminders);

export default router;
