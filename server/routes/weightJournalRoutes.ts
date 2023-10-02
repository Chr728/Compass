import { Router } from 'express';
import {
  getWeightJournals,
  getWeightJournal,
  createWeightJournal,
  updateWeightJournal,
  deleteWeightJournal,
} from '../controllers/weightJournalController';

const router = Router();

router.route('/user/:id').get(getWeightJournals).post(createWeightJournal);

router
  .route('/:weightJournalId')
  .delete(deleteWeightJournal)
  .put(updateWeightJournal)
  .get(getWeightJournal);

export default router;
