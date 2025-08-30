import { UserController } from "@/controllers/user-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";
import { Router } from "express";
import { Role } from "generated/prisma";

const userRoutes = Router();
const userController = new UserController();

userRoutes.get("/", ensureAuthenticated, userController.getAuthUser);
userRoutes.get(
  "/:id",
  ensureAuthenticated,
  verifyUserAuthorization([Role.ADMIN]),
  userController.getUserById
);

export { userRoutes };
