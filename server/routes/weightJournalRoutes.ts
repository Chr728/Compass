import { Router } from 'express';
import {
  getWeightJournals,
  getWeightJournal,
  createWeightJournal,
  updateWeightJournal,
  deleteWeightJournal,
} from '../controllers/weightJournalController';

const router = Router();

router.route('/').get(getWeightJournals).post(createWeightJournal);

router
  .route('/:id')
  .get(getWeightJournal)
  .put(updateWeightJournal)
  .delete(deleteWeightJournal);

export default router;
