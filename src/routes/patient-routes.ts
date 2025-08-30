import { Router } from "express";
import { PatientController } from "@/controllers/patient-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";

const patientRoutes = Router();
const patientController = new PatientController();

patientRoutes.post("/", ensureAuthenticated, patientController.create);

export { patientRoutes };
