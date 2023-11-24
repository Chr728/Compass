import { Router } from 'express';
import enforceAuthorization from '../middlewares/enforceAuthorization';
import {
  getWeightJournals,
  getWeightJournal,
  createWeightJournal,
  updateWeightJournal,
  deleteWeightJournal,
} from '../controllers/weightJournalController';

const router = Router();

router
  .route('/user/:uid')
  .get(enforceAuthorization, getWeightJournals)
  .post(enforceAuthorization, createWeightJournal);

router
  .route('/:weightJournalId')
  .delete(deleteWeightJournal)
  .put(updateWeightJournal)
  .get(getWeightJournal);

export default router;
