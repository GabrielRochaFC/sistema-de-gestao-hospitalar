import { Router } from "express";
import { PrescriptionController } from "@/controllers/prescription-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";

const prescriptionController = new PrescriptionController();
const prescriptionRoutes = Router();

prescriptionRoutes.use(ensureAuthenticated);

prescriptionRoutes.post(
  "/",
  verifyUserAuthorization(["PROFESSIONAL"]),
  (req, res) => prescriptionController.create(req, res)
);

prescriptionRoutes.post(
  "/:id/cancel",
  verifyUserAuthorization(["PROFESSIONAL", "ADMIN"]),
  (req, res) => prescriptionController.cancel(req, res)
);

prescriptionRoutes.get(
  "/patient/:patientId",
  verifyUserAuthorization(["PROFESSIONAL", "ADMIN"]),
  (req, res) => prescriptionController.listByPatient(req, res)
);

prescriptionRoutes.get(
  "/professional/me",
  verifyUserAuthorization(["PROFESSIONAL"]),
  (req, res) => prescriptionController.listByProfessional(req, res)
);

export { prescriptionRoutes };
