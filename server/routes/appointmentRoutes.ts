import { Router } from 'express';
import enforceAuthorization from '../middlewares/enforceAuthorization';
import {
  getAppointments,
  createAppointment,
  getAppointment,
  deleteAppointment,
  updateAppointments,
} from '../controllers/appointmentController';

const router = Router();

router
  .route('/:uid')
  .get(enforceAuthorization, getAppointments)
  .post(enforceAuthorization, createAppointment);

router
  .route('/single/:id')
  .get(getAppointment)
  .delete(deleteAppointment)
  .put(updateAppointments);

export default router;
