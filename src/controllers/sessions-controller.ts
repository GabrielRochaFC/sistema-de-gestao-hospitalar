import { authConfig } from "@/configs/auth";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { compare } from "bcrypt";
import { Request, Response } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";
import z from "zod";

export class SessionsController {
  async create(req: Request, res: Response) {
    const bodySchema = z.object({
      email: z.email(),
      password: z.string().min(6),
    });

    const { email, password } = bodySchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = jwt.sign(
      {
        role: user.role ?? "PATIENT",
      },
      secret,
      {
        subject: user.id,
        expiresIn,
      } as SignOptions
    );

    const { password: _, ...userWithoutPassword } = user;

    return res.json({
      token,
      user: userWithoutPassword,
    });
  }
}
