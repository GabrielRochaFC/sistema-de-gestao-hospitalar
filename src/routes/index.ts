import { Router } from "express";
import { sessionsRoutes } from "./session-routes";
import { patientRoutes } from "./patient-routes";
import { professionalRoutes } from "./professional-routes";
import { userRoutes } from "./user-routes";
import appointmentRoutes from "./appointment-routes";

const routes = Router();

routes.use("/auth", sessionsRoutes);
routes.use("/patients", patientRoutes);
routes.use("/professionals", professionalRoutes);
routes.use("/users", userRoutes);
routes.use("/appointments", appointmentRoutes);

export { routes };
