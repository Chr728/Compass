import { Router } from 'express';
import enforceAuthorization from '../middlewares/enforceAuthorization';
import {
    getActivityJournals,
    getActivityJournal,
    createActivityJournal,
    updateActivityJournal,
    deleteActivityJournal,
} from '../controllers/activityJournalController';

const router = Router();

router
    .route('/user/:uid')
    .get(enforceAuthorization, getActivityJournals)
    .post(enforceAuthorization, createActivityJournal);

router
    .route('/:activity_journal_id')
    .get(getActivityJournal)
    .put(updateActivityJournal)
    .delete(deleteActivityJournal);

export default router;
