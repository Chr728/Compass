import { Router } from 'express';
import enforceAuthorization from '../middlewares/enforceAuthorization';
import {
  createO2SaturationJournal,
  deleteO2SaturationJournal,
  getO2SaturationJournal,
  getO2SaturationJournals,
  updateO2SaturationJournal,
} from '../controllers/o2SaturationJournalController';

const router = Router();

router
  .route('/user/:uid')
  .get(enforceAuthorization, getO2SaturationJournals)
  .post(enforceAuthorization, createO2SaturationJournal);

router
  .route('/:id')
  .get(getO2SaturationJournal)
  .put(updateO2SaturationJournal)
  .delete(deleteO2SaturationJournal);

export default router;
