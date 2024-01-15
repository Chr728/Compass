import { Router } from 'express';
import enforceAuthorization from '../middlewares/enforceAuthorization';
import {
  createMedication,
  getMedications,
  getMedication,
  updateMedication,
  deleteMedication,
  upload,
  createImage,
  updateImage
} from '../controllers/medicationController';

const router = Router();

router
  .route('/user/:uid')
  .get(enforceAuthorization,getMedications)
  .post(enforceAuthorization,createMedication);
  //enforceAuthorization,
router
  .route('/:id')
  .get(getMedication)
  .put(updateMedication)
  .delete(deleteMedication);

router.route("/uploadImage/:id").put(upload.single("image"), createImage)

router.route("/updateImage/:id").put(upload.single("image"), updateImage)

export default router;
