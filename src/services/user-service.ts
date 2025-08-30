import { prisma } from "@/database/prisma";
import { CreateUserData } from "@/schemas/user-schemas";
import { AppError } from "@/utils/AppError";
import { hash } from "bcrypt";
import { User } from "generated/prisma";

interface CreateUserResponse {
  user: Omit<User, "password">;
}

async function validateUserCreation(email: string, cpf: string) {
  const userWithSameEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (userWithSameEmail) {
    throw new AppError("E-mail já cadastrado no sistema", 400);
  }

  const userWithSameCpf = await prisma.user.findUnique({
    where: { cpf },
  });

  if (userWithSameCpf) {
    throw new AppError("CPF já cadastrado no sistema", 400);
  }
}

export async function createUser({
  firstName,
  lastName,
  email,
  password,
  cpf,
  phone,
}: CreateUserData): Promise<CreateUserResponse> {
  await validateUserCreation(email, cpf);

  const hashedPassword = await hash(password, 10);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      cpf,
      role: [],
      phone,
    },
  });

  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
  };
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      patient: true,
      professional: true,
    },
  });

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
