import { Router } from 'express';
import enforceAuthorization from '../middlewares/enforceAuthorization';
import {
  createSubscription,
  getSubscription,
  updateSubscription,
  deleteSubscription,
} from '../controllers/subscriptionController';

const router = Router();

router
  .route('/:uid')
  .get(enforceAuthorization, getSubscription)
  .post(enforceAuthorization, createSubscription)
  .put(enforceAuthorization, updateSubscription)
  .delete(enforceAuthorization, deleteSubscription);

export default router;
