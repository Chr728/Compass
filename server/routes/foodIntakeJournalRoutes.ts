import { Router } from 'express';
import enforceAuthorization from '../middlewares/enforceAuthorization';
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
  .get(enforceAuthorization, getFoodIntakeJournals)
  .post(enforceAuthorization, createFoodIntakeJournal);

router
  .route('/:id')
  .get(getFoodIntakeJournal)
  .put(updateFoodIntakeJournal)
  .delete(deleteFoodIntakeJournal);

export default router;
