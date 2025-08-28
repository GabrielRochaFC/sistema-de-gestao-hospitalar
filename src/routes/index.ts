import { Router } from "express";
import { sessionsRoutes } from "./session-routes";

const routes = Router();

routes.use("/auth", sessionsRoutes);

export { routes };
