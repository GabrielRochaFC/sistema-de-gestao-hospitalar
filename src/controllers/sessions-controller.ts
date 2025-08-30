import { Request, Response } from "express";
import { authenticate } from "@/services/auth-service";
import { createSessionSchema } from "@/schemas/session-schemas";
import { createUserSchema } from "@/schemas/user-schemas";
import { createUser } from "@/services/user-service";

export class SessionsController {
  async login(req: Request, res: Response) {
    const { email, password } = createSessionSchema.parse(req.body);

    const { token, user } = await authenticate({ email, password });

    return res.json({
      token,
      user,
    });
  }

  async register(req: Request, res: Response) {
    const userData = createUserSchema.parse(req.body);

    const { user } = await createUser(userData);

    return res.status(201).json(user);
  }
}
