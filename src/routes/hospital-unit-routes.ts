import { Router } from "express";
import { HospitalUnitController } from "@/controllers/hospital-unit-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";
import { Role } from "generated/prisma";

const hospitalUnitRoutes = Router();
const hospitalUnitController = new HospitalUnitController();

hospitalUnitRoutes.use(ensureAuthenticated);

hospitalUnitRoutes.post(
  "/",
  verifyUserAuthorization([Role.ADMIN]),
  hospitalUnitController.create
);

hospitalUnitRoutes.get("/", hospitalUnitController.index);

hospitalUnitRoutes.put(
  "/:id",
  verifyUserAuthorization([Role.ADMIN]),
  hospitalUnitController.update
);

hospitalUnitRoutes.post(
  "/:id/professionals",
  verifyUserAuthorization([Role.ADMIN]),
  hospitalUnitController.addProfessional
);

export { hospitalUnitRoutes };
