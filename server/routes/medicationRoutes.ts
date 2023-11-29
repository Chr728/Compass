import { Router } from 'express';
import enforceAuthorization from '../middlewares/enforceAuthorization';
import {
  createMedication,
  getMedications,
  getMedication,
  updateMedication,
  deleteMedication,
} from '../controllers/medicationController';

const router = Router();

router
  .route('/user/:uid')
  .get(enforceAuthorization, getMedications)
  .post(enforceAuthorization, createMedication);

router
  .route('/:id')
  .get(getMedication)
  .put(updateMedication)
  .delete(deleteMedication);

export default router;
