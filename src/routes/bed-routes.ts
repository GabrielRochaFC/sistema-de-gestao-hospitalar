import { Router } from "express";
import { BedController } from "@/controllers/bed-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";
import { Role } from "generated/prisma";

const bedRoutes = Router();
const bedController = new BedController();

bedRoutes.use(ensureAuthenticated);

bedRoutes.post(
  "/",
  verifyUserAuthorization([Role.ADMIN]),
  bedController.create
);
bedRoutes.get(
  "/:id",
  verifyUserAuthorization([Role.ADMIN]),
  bedController.findById
);
bedRoutes.get(
  "/unit/:unitId",
  verifyUserAuthorization([Role.ADMIN]),
  bedController.findByUnit
);
bedRoutes.put(
  "/:id",
  verifyUserAuthorization([Role.ADMIN]),
  bedController.update
);
bedRoutes.delete(
  "/:id",
  verifyUserAuthorization([Role.ADMIN]),
  bedController.delete
);

export { bedRoutes };
