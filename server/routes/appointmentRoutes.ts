import { Router } from "express";
import {
  getAppointments,
  createAppointment,
  getAppointment,
  deleteAppointment,
  updateAppointments
} from "../controllers/appointmentController";

const router = Router();

router
  .route("/:id")
  .get(getAppointments)
  .post(createAppointment);
  

router
  .route("/single/:id")
  .get(getAppointment)
  .delete(deleteAppointment)
  .post(updateAppointments);

export default router;
