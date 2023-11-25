import { Router } from 'express';
import enforceAuthorization from '../middlewares/enforceAuthorization';
import {
  getGlucoseJournals,
  getGlucoseJournal,
  createGlucoseJournal,
  updateGlucoseJournal,
  deleteGlucoseJournal,
} from '../controllers/diabeticGlucoseJournalController';

const router = Router();

router
  .route('/user/:uid')
  .get(enforceAuthorization, getGlucoseJournals)
  .post(enforceAuthorization, createGlucoseJournal);

router
  .route('/:id')
  .get(getGlucoseJournal)
  .put(updateGlucoseJournal)
  .delete(deleteGlucoseJournal);

export default router;
