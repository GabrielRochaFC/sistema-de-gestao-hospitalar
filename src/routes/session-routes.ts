import { SessionsController } from "@/controllers/sessions-controller";
import { Router } from "express";

const sessionsRoutes = Router();

const sessionsController = new SessionsController();

sessionsRoutes.post("/login", sessionsController.create);

export { sessionsRoutes };
