import { Router } from "express";
import { PatientController } from "@/controllers/patient-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";
import { Role } from "generated/prisma";

const patientRoutes = Router();
const patientController = new PatientController();

patientRoutes.post("/", ensureAuthenticated, patientController.create);
patientRoutes.get(
  "/appointments",
  ensureAuthenticated,
  verifyUserAuthorization([Role.PATIENT]),
  patientController.findAllAppointments
);
patientRoutes.get(
  "/appointments/telemedicine",
  ensureAuthenticated,
  verifyUserAuthorization([Role.PATIENT]),
  patientController.findAllTelemedicineAppointments
);

patientRoutes.get(
  "/exams",
  ensureAuthenticated,
  verifyUserAuthorization([Role.PATIENT]),
  patientController.findAllExams
);

patientRoutes.get(
  "/clinical-notes",
  ensureAuthenticated,
  verifyUserAuthorization([Role.PATIENT]),
  (req, res) => patientController.findAllClinicalNotes(req, res)
);

patientRoutes.get(
  "/prescriptions",
  ensureAuthenticated,
  verifyUserAuthorization([Role.PATIENT]),
  (req, res) => patientController.findAllPrescriptions(req, res)
);

export { patientRoutes };
