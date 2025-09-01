import { Router } from "express";
import { ClinicalNoteController } from "@/controllers/clinical-note-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";

const clinicalNoteController = new ClinicalNoteController();
const clinicalNoteRoutes = Router();

clinicalNoteRoutes.use(ensureAuthenticated);

clinicalNoteRoutes.post(
  "/",
  verifyUserAuthorization(["PROFESSIONAL"]),
  (req, res) => clinicalNoteController.create(req, res)
);

clinicalNoteRoutes.get(
  "/patient/:patientId",
  verifyUserAuthorization(["PROFESSIONAL", "ADMIN"]),
  (req, res) => clinicalNoteController.listByPatient(req, res)
);

clinicalNoteRoutes.get(
  "/professional/me",
  verifyUserAuthorization(["PROFESSIONAL"]),
  (req, res) => clinicalNoteController.listByProfessional(req, res)
);

export { clinicalNoteRoutes };
