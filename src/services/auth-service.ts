import { authConfig } from "@/configs/auth";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { compare } from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import { User } from "generated/prisma";

interface AuthRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: Omit<User, "password">;
}

export class AuthService {
  async authenticate({ email, password }: AuthRequest): Promise<AuthResponse> {
    const user = await this.findUserByEmail(email);

    await this.validatePassword(password, user.password);

    const token = this.generateToken(user.id, user.role);

    const { password: _, ...userWithoutPassword } = user;

    return {
      token,
      user: userWithoutPassword,
    };
  }

  private async findUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    return user;
  }

  private async validatePassword(
    plainPassword: string,
    hashedPassword: string
  ) {
    const isPasswordValid = await compare(plainPassword, hashedPassword);

    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }
  }

  private generateToken(userId: string, role: string | null) {
    const { secret, expiresIn } = authConfig.jwt;

    return jwt.sign(
      {
        role: role ?? "PATIENT",
      },
      secret,
      {
        subject: userId,
        expiresIn,
      } as SignOptions
    );
  }
}
