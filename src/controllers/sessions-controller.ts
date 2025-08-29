import { Request, Response } from "express";
import z from "zod";
import { AuthService } from "@/services/auth-service";

export class SessionsController {
  async create(req: Request, res: Response) {
    const bodySchema = z.object({
      email: z.email(),
      password: z.string().min(6),
    });

    const { email, password } = bodySchema.parse(req.body);

    const authService = new AuthService();
    const { token, user } = await authService.authenticate(email, password);

    return res.json({
      token,
      user,
    });
  }
}
