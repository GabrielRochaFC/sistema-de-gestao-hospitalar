import { Router } from "express";
import { PatientController } from "@/controllers/patient-controller";

const patientRoutes = Router();
const patientController = new PatientController();

patientRoutes.post("/", patientController.create);

export { patientRoutes };
