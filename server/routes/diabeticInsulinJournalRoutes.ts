import { Router } from 'express';
import {} from '../controllers/diabeticInsulinJournalController';

const router = Router();

router.route('/user/:uid').get().post();

router.route('/:id').get().put().delete();

export default router;
