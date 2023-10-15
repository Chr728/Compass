import { Router } from 'express';
import {
  getMoodJournals,
  getMoodJournal,
  createMoodJournal,
  updateMoodJournal,
  deleteMoodJournal,
} from '../controllers/moodJournalController';

const router = Router();

router.route('/user/:user_id').get(getMoodJournals).post(createMoodJournal);

router
  .route('/:mood_journal_id')
  .get(getMoodJournal)
  .put(updateMoodJournal)
  .delete(deleteMoodJournal);

export default router;
