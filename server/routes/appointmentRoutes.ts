import { Router } from "express";
import {
  getAppointments,
  createAppointment,
  getAppointment,
  deleteAppointment
} from "../controllers/appointmentController";

const router = Router();

router.route("/:email").get(getAppointments).post(createAppointment);

router.route("/:id").get(getAppointment).delete(deleteAppointment);

export default router;
