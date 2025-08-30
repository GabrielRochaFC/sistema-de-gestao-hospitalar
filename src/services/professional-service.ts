import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { Professional, Role } from "generated/prisma";
import type { CreateProfessionalData } from "@/schemas/professional-schemas";

interface CreateProfessionalResponse {
  professional: Professional;
}

async function validateProfessionalCreation(
  userId: string,
  licenseNumber: string
) {
  const userExists = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userExists) {
    throw new AppError("Usuário não encontrado", 404);
  }

  const professional = await prisma.professional.findUnique({
    where: { userId },
  });

  if (professional) {
    throw new AppError("Profissional já cadastrado", 400);
  }

  const professionalWithSameLicense = await prisma.professional.findUnique({
    where: { licenseNumber },
  });

  if (professionalWithSameLicense) {
    throw new AppError("Número de licença já cadastrado", 400);
  }
}

export async function createProfessional({
  licenseNumber,
  type,
  specialties,
  userId,
}: CreateProfessionalData): Promise<CreateProfessionalResponse> {
  await validateProfessionalCreation(userId, licenseNumber);

  const result = await prisma.$transaction(async (tx) => {
    const newProfessional = await tx.professional.create({
      data: {
        userId,
        licenseNumber,
        type,
        specialties,
      },
    });

    await tx.user.update({
      where: { id: userId },
      data: {
        role: {
          push: Role.PROFESSIONAL,
        },
      },
    });

    return newProfessional;
  });

  return {
    professional: result,
  };
}
