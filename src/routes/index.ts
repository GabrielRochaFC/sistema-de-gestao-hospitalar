import { Router } from "express";
import { sessionsRoutes } from "./session-routes";
import { patientRoutes } from "./patient-routes";

const routes = Router();

routes.use("/auth", sessionsRoutes);
routes.use("/patients", patientRoutes);

export { routes };
