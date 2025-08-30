import { UserController } from "@/controllers/user-controller";
import { Router } from "express";

const userRoutes = Router();
const userController = new UserController();

userRoutes.get("/:id", userController.get);

export { userRoutes };
