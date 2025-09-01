import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { Patient, Role } from "generated/prisma";
import { ExamsPaginationData } from "@/schemas/exam-schemas";
import { listExamsByPatient } from "@/services/exam-service";
import type { CreatePatientData } from "@/schemas/patient-schemas";

interface CreatePatientResponse {
  patient: Patient;
}

export async function createPatient({
  userId,
  address,
  healthPlan,
  allergies,
  bloodType,
  emergencyContact,
}: CreatePatientData): Promise<CreatePatientResponse> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  const patient = await prisma.patient.findUnique({
    where: { userId },
  });

  if (patient) {
    throw new AppError("Paciente já cadastrado", 400);
  }

  const result = await prisma.$transaction(async (tx) => {
    const newPatient = await tx.patient.create({
      data: {
        userId,
        address: {
          create: address,
        },
        healthPlan,
        allergies,
        bloodType,
        emergencyContact,
      },
    });

    await tx.user.update({
      where: { id: userId },
      data: {
        role: {
          push: Role.PATIENT,
        },
      },
    });

    return { patient: newPatient };
  });

  return result;
}

export async function listPatientUserExams(
  userId: string | undefined,
  { page, limit }: ExamsPaginationData
) {
  if (!userId) {
    throw new AppError("Usuário não autenticado", 401);
  }

  const patient = await prisma.patient.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!patient) {
    throw new AppError("Paciente não encontrado", 404);
  }

  return listExamsByPatient(patient.id, { page, limit });
}
