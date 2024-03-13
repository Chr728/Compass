import { Router } from 'express';
import enforceAuthorization from '../middlewares/enforceAuthorization';
import {
  getSnoringResults,
  getSnoringResult,
  createSnoringResult,
  deleteSnoringResult,
} from '../controllers/snoringResultController';

const router = Router();

router
  .route('/user/:uid')
  .get(enforceAuthorization, getSnoringResults)
  .post(enforceAuthorization, createSnoringResult);

router.route('/:id').get(getSnoringResult).delete(deleteSnoringResult);

export default router;
