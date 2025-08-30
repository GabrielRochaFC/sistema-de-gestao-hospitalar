import { Request, Response } from "express";
import { getUserById } from "@/services/user-service";
import { getUserSchema } from "@/schemas/user-schemas";

export class UserController {
  async getAuthUser(req: Request, res: Response) {
    const userId = req.user?.id;
    const id = getUserSchema.parse(userId);
    const response = await getUserById(id);
    return res.status(200).json(response);
  }

  async getUserById(req: Request, res: Response) {
    const id = getUserSchema.parse(req.params.id);
    const response = await getUserById(id);
    return res.status(200).json(response);
  }
}
