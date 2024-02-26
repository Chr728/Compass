import {Router} from "express";
import enforceAuthorization from "../middlewares/enforceAuthorization";
import {
  createBloodPressureJournal,
  deleteBloodPressureJournal,
  getBloodPressureJournal,
  getBloodPressureJournals,
  updateBloodPressureJournal,
} from "../controllers/bloodPressureController";

const router = Router();

router
  .route('/user/:uid')
  .get(enforceAuthorization, getBloodPressureJournals)
  .post(enforceAuthorization, createBloodPressureJournal);

router
    .route('/:id')
    .get(getBloodPressureJournal)
    .put(updateBloodPressureJournal)
    .delete(deleteBloodPressureJournal);

export default router;