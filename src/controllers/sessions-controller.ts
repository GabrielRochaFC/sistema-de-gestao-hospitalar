import { Request, Response } from "express";
import { AuthService } from "@/services/auth-service";
import { createSessionSchema } from "@/schemas/session-schemas";

export class SessionsController {
  async create(req: Request, res: Response) {
    const { email, password } = createSessionSchema.parse(req.body);

    const authService = new AuthService();
    const { token, user } = await authService.authenticate({ email, password });

    return res.json({
      token,
      user,
    });
  }
}
