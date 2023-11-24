import {
  createSpeedDial,
  getSpeedDial,
  getSpeedDials,
  updateSpeedDial,
  deleteSpeedDial,
} from '../controllers/speedDialController';
import enforceAuthorization from '../middlewares/enforceAuthorization';
import { Router } from 'express';
const router = Router();

router
  .route('/:uid')
  .get(enforceAuthorization, getSpeedDials)
  .post(enforceAuthorization, createSpeedDial);

router
  .route('/:uid/:id')
  .get(getSpeedDial)
  .put(updateSpeedDial)
  .delete(deleteSpeedDial);

export default router;
