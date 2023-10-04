import { Router } from 'express';
import {
    getActivityJournals,
    getActivityJournal,
    createActivityJournal,
    updateActivityJournal,
    deleteActivityJournal,
} from '../controllers/activityJournalController';

const router = Router();

router
    .route('/user/:user_id')
    .get(getActivityJournals)
    .post(createActivityJournal);

router
    .route('/:activity_journal_id')
    .get(getActivityJournal)
    .put(updateActivityJournal)
    .delete(deleteActivityJournal);

export default router;
