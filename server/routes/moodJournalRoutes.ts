import { Router } from 'express';
import enforceAuthorization from '../middlewares/enforceAuthorization';
import {
  getMoodJournals,
  getMoodJournal,
  createMoodJournal,
  updateMoodJournal,
  deleteMoodJournal,
} from '../controllers/moodJournalController';

const router = Router();

router
  .route('/user/:uid')
  .get(enforceAuthorization, getMoodJournals)
  .post(enforceAuthorization, createMoodJournal);

router
  .route('/:mood_journal_id')
  .get(getMoodJournal)
  .put(updateMoodJournal)
  .delete(deleteMoodJournal);

export default router;
