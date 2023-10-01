import { Router } from "express";
import {
  getAppointments,
  createAppointment,
  getAppointment,
  deleteAppointment,
} from "../controllers/appointmentController";

const router = Router();

router.route("/:id").get(getAppointments);

router
  .route("/single/:id")
  .get(getAppointment)
  .delete(deleteAppointment)
  .post(createAppointment);

export default router;
