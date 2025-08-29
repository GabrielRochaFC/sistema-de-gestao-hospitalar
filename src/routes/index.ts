import { Router } from "express";
import { sessionsRoutes } from "./session-routes";
import { patientRoutes } from "./patient-routes";
import { professionalRoutes } from "./professional-routes";

const routes = Router();

routes.use("/auth", sessionsRoutes);
routes.use("/patients", patientRoutes);
routes.use("/professionals", professionalRoutes);

export { routes };
