import { Request, Response } from "express";
import { getUserById } from "@/services/user-service";
import { getUserSchema } from "@/schemas/user-schemas";

export class UserController {
  async get(req: Request, res: Response) {
    const { id } = getUserSchema.parse(req.params);
    const response = await getUserById(id);
    return res.status(200).json(response);
  }
}
