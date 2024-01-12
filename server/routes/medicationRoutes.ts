import { Router } from 'express';
import enforceAuthorization from '../middlewares/enforceAuthorization';
import {
  createMedication,
  getMedications,
  getMedication,
  updateMedication,
  deleteMedication,
  upload,
} from '../controllers/medicationController';

const router = Router();

router
  .route('/user/:uid')
  .get(enforceAuthorization, getMedications)
  .post(enforceAuthorization, upload.single("image"), createMedication);
  
router
  .route('/:id')
  .get(getMedication)
  .put(upload.single("image"), updateMedication)
  .delete(deleteMedication);

export default router;
