import { Router } from 'express';
import {
    createFoodIntakeJournal,
    getFoodIntakeJournals,
    getFoodIntakeJournal,
    updateFoodIntakeJournal,
    deleteFoodIntakeJournal,
} from '../controllers/foodIntakeJournalController';

const router = Router();

router
    .route('/user/:uid')
    .get(getFoodIntakeJournals)
    .post(createFoodIntakeJournal);

router
    .route('/:id')
    .get(getFoodIntakeJournal)
    .put(updateFoodIntakeJournal)
    .delete(deleteFoodIntakeJournal);

export default router;