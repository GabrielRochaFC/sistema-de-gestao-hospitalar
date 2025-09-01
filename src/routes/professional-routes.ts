import { Router } from "express";
import { ProfessionalController } from "@/controllers/professional-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";
import { Role } from "generated/prisma";

const professionalRoutes = Router();
const professionalController = new ProfessionalController();

professionalRoutes.post(
  "/",
  ensureAuthenticated,
  professionalController.create
);

professionalRoutes.get(
  "/appointments",
  ensureAuthenticated,
  verifyUserAuthorization([Role.PROFESSIONAL]),
  professionalController.findAllAppointments
);

professionalRoutes.get(
  "/exams",
  ensureAuthenticated,
  verifyUserAuthorization([Role.PROFESSIONAL]),
  professionalController.findAllExams
);

export { professionalRoutes };
