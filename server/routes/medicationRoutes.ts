import { Router } from 'express';
import {
    createMedication,
    getMedications,
    getMedication,
    updateMedication,
    deleteMedication
} from '../controllers/medicationController';

const router = Router();

router
    .route('/user/:uid')
    .get(getMedications)
    .post(createMedication);

router
    .route('/:id')
    .get(getMedication)
    .put(updateMedication)
    .delete(deleteMedication);

export default router;