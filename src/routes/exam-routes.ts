import { Router } from "express";
import { ExamController } from "@/controllers/exam-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";
import { Role } from "generated/prisma";

const examRoutes = Router();
const controller = new ExamController();

examRoutes.use(
  ensureAuthenticated,
  verifyUserAuthorization([Role.ADMIN, Role.PROFESSIONAL])
);

examRoutes.post("/", controller.create);

examRoutes.get("/:id", controller.getById);

examRoutes.get("/patient/:patientId", controller.listByPatient);

examRoutes.get("/unit/:unitId", controller.listByUnit);

examRoutes.post("/:id/schedule", controller.schedule);
examRoutes.post("/:id/start", controller.start);
examRoutes.post("/:id/complete", controller.complete);
examRoutes.post("/:id/cancel", controller.cancel);

export { examRoutes };
