import { Router } from 'express';
import enforceAuthorization from '../middlewares/enforceAuthorization';
import {
  getInsulinJournals,
  getInsulinJournal,
  createInsulinJournal,
  updateInsulinJournal,
  deleteInsulinJournal,
} from '../controllers/diabeticInsulinJournalController';

const router = Router();

router
  .route('/user/:uid')
  .get(enforceAuthorization, getInsulinJournals)
  .post(enforceAuthorization, createInsulinJournal);

router
  .route('/:id')
  .get(getInsulinJournal)
  .put(updateInsulinJournal)
  .delete(deleteInsulinJournal);

export default router;
