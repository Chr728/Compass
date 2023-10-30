import { Router } from 'express';
import {
  getInsulinJournals,
  getInsulinJournal,
  createInsulinJournal,
  updateInsulinJournal,
  deleteInsulinJournal,
} from '../controllers/diabeticInsulinJournalController';

const router = Router();

router.route('/user/:uid').get(getInsulinJournals).post(createInsulinJournal);

router
  .route('/:id')
  .get(getInsulinJournal)
  .put(updateInsulinJournal)
  .delete(deleteInsulinJournal);

export default router;
