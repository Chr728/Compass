import { Router } from 'express';
import {
  getGlucoseJournals,
  getGlucoseJournal,
  createGlucoseJournal,
  updateGlucoseJournal,
  deleteGlucoseJournal,
} from '../controllers/diabeticGlucoseJournalController';

const router = Router();

router.route('/user/:uid').get(getGlucoseJournals).post(createGlucoseJournal);

router
  .route('/:id')
  .get(getGlucoseJournal)
  .put(updateGlucoseJournal)
  .delete(deleteGlucoseJournal);

export default router;
