import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { hash } from "bcrypt";
import { Professional, User } from "generated/prisma";
import type { CreateProfessionalData } from "@/schemas/professional-schemas";

interface CreateProfessionalResponse {
  user: Omit<User, "password">;
  professional: Professional;
}

async function validateUserCreation(email: string, cpf: string) {
  const userWithSameEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (userWithSameEmail) {
    throw new AppError("Dados inválidos para cadastro", 400);
  }

  const userWithSameCpf = await prisma.user.findUnique({
    where: { cpf },
  });

  if (userWithSameCpf) {
    throw new AppError("Dados inválidos para cadastro", 400);
  }
}

async function validateLicenseNumber(licenseNumber: string) {
  const professionalWithSameLicense = await prisma.professional.findUnique({
    where: { licenseNumber },
  });

  if (professionalWithSameLicense) {
    throw new AppError("Dados inválidos para cadastro", 400);
  }
}

export async function createProfessional({
  firstName,
  lastName,
  email,
  password,
  cpf,
  licenseNumber,
  type,
  specialties,
  phone,
}: CreateProfessionalData): Promise<CreateProfessionalResponse> {
  await validateUserCreation(email, cpf);
  await validateLicenseNumber(licenseNumber);

  const result = await prisma.$transaction(async (tx) => {
    const hashedPassword = await hash(password, 10);

    const user = await tx.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        cpf,
        role: "PROFESSIONAL",
      },
    });

    const professional = await tx.professional.create({
      data: {
        userId: user.id,
        licenseNumber,
        type,
        specialties,
        phone,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      professional,
    };
  });

  return result;
}
