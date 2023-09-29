import { Router } from 'express';
import {
  getWeightJournals,
  getWeightJournal,
  createWeightJournal,
  updateWeightJournal,
  deleteWeightJournal,
} from '../controllers/weightJournalController';

const router = Router();

router.route('/').get(getWeightJournals);

router
  .route('/:id')
  .get(getWeightJournal)
  .post(createWeightJournal)
  .put(updateWeightJournal)
  .delete(deleteWeightJournal);

export default router;
