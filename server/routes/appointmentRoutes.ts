import { Router } from "express";
import {
  getAppointments,
  createAppointment,
} from "../controllers/appointmentController";

const router = Router();

router.route("/:email").get(getAppointments).post(createAppointment);

export default router;
