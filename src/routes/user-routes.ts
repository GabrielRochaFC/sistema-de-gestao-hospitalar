import { UserController } from "@/controllers/user-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";
import { Router } from "express";
import { Role } from "generated/prisma";

const userRoutes = Router();
const userController = new UserController();

userRoutes.use(ensureAuthenticated);

userRoutes.get("/me", userController.getAuthUser);
userRoutes.put("/me", userController.updateOwnProfile);

userRoutes.get(
  "/",
  verifyUserAuthorization([Role.ADMIN]),
  userController.getAllUsers
);

userRoutes.get(
  "/all",
  verifyUserAuthorization([Role.ADMIN]),
  userController.getAllUsersWithInactive
);

userRoutes.get(
  "/:id",
  verifyUserAuthorization([Role.ADMIN]),
  userController.getUserById
);
userRoutes.put(
  "/:id",
  verifyUserAuthorization([Role.ADMIN]),
  userController.updateUser
);
userRoutes.patch(
  "/:id/status",
  verifyUserAuthorization([Role.ADMIN]),
  userController.updateUserStatus
);
userRoutes.delete(
  "/:id",
  verifyUserAuthorization([Role.ADMIN]),
  userController.deleteUser
);

export { userRoutes };
