import { Router } from "express";
import { ProfessionalController } from "@/controllers/professional-controller";

const professionalRoutes = Router();
const professionalController = new ProfessionalController();

professionalRoutes.post("/", professionalController.create);

export { professionalRoutes };
