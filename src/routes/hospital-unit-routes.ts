import { Router } from "express";
import { HospitalUnitController } from "@/controllers/hospital-unit-controller";
import { AdmissionController } from "@/controllers/admission-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";
import { Role } from "generated/prisma";

const hospitalUnitRoutes = Router();
const hospitalUnitController = new HospitalUnitController();
const admissionController = new AdmissionController();

hospitalUnitRoutes.use(ensureAuthenticated);

hospitalUnitRoutes.post(
  "/",
  verifyUserAuthorization([Role.ADMIN]),
  hospitalUnitController.create
);

hospitalUnitRoutes.get("/", hospitalUnitController.index);

hospitalUnitRoutes.put(
  "/:id",
  verifyUserAuthorization([Role.ADMIN]),
  hospitalUnitController.update
);

hospitalUnitRoutes.post(
  "/:id/professionals",
  verifyUserAuthorization([Role.ADMIN]),
  hospitalUnitController.addProfessional
);

hospitalUnitRoutes.get(
  "/:id/professionals",
  verifyUserAuthorization([Role.ADMIN, Role.PROFESSIONAL]),
  hospitalUnitController.professionals
);

hospitalUnitRoutes.get(
  "/:id/appointments",
  verifyUserAuthorization([Role.ADMIN, Role.PROFESSIONAL]),
  hospitalUnitController.appointments
);

hospitalUnitRoutes.get(
  "/:id/admissions",
  verifyUserAuthorization([Role.ADMIN]),
  admissionController.list
);

export { hospitalUnitRoutes };
