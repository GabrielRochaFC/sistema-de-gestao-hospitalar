import { Router } from "express";
import { ProfessionalController } from "@/controllers/professional-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";

const professionalRoutes = Router();
const professionalController = new ProfessionalController();

professionalRoutes.post(
  "/",
  ensureAuthenticated,
  professionalController.create
);

export { professionalRoutes };
