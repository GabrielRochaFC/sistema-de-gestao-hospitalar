import { Router } from "express";
import { AdmissionController } from "@/controllers/admission-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";
import { Role } from "generated/prisma";

const admissionRoutes = Router();
const controller = new AdmissionController();

admissionRoutes.use(ensureAuthenticated, verifyUserAuthorization([Role.ADMIN]));

admissionRoutes.post("/", controller.create);
admissionRoutes.get("/:id", controller.getById);
admissionRoutes.post("/:id/discharge", controller.discharge);
admissionRoutes.post("/:id/cancel", controller.cancel);

export { admissionRoutes };
