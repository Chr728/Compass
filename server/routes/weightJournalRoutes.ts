import { Router } from 'express';
import {
  getWeightJournals,
  getWeightJournal,
  createWeightJournal,
  updateWeightJournal,
  deleteWeightJournal,
} from '../controllers/weightJournalController';

const router = Router();

router.route('/:id').get(getWeightJournals).post(createWeightJournal);

router
  .route('/:id/:weightJournalId')
  .get(getWeightJournal)
  .put(updateWeightJournal)
  .delete(deleteWeightJournal);

export default router;
