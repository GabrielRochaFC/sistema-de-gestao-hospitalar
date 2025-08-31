import { AppointmentController } from "@/controllers/appointment-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";
import { Router } from "express";
import { Role } from "generated/prisma";

const appointmentController = new AppointmentController();
const appointmentRoutes = Router();

appointmentRoutes.use(ensureAuthenticated);

appointmentRoutes.post(
  "/",
  verifyUserAuthorization([Role.PATIENT]),
  appointmentController.create
);
appointmentRoutes.patch(
  "/:appointmentId",
  verifyUserAuthorization([Role.PATIENT]),
  appointmentController.cancelAppointment
);

export default appointmentRoutes;
