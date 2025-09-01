import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { ClinicalNoteType } from "generated/prisma";
import {
  CreateClinicalNoteData,
  ClinicalNotePaginationData,
} from "@/schemas/clinical-schemas";
import { PaginatedResponse } from "@/schemas/pagination-schemas";

async function ensurePatient(patientId: string) {
  const patient = await prisma.patient.findUnique({ where: { id: patientId } });
  if (!patient) throw new AppError("Paciente não encontrado", 404);
  return patient;
}

async function ensureProfessional(optionalProfessionalId?: string) {
  if (!optionalProfessionalId) return;
  const professional = await prisma.professional.findUnique({
    where: { id: optionalProfessionalId },
  });
  if (!professional) throw new AppError("Profissional não encontrado", 404);
}

export async function createClinicalNote(data: CreateClinicalNoteData) {
  await ensurePatient(data.patientId);
  await ensureProfessional(data.professionalId);

  const note = await prisma.clinicalNote.create({
    data: {
      patientId: data.patientId,
      professionalId: data.professionalId,
      type: data.type as ClinicalNoteType,
      content: data.content,
    },
  });
  return { note };
}

export async function listClinicalNotesByPatient(
  patientId: string,
  { page, limit }: ClinicalNotePaginationData
): Promise<PaginatedResponse<any>> {
  await ensurePatient(patientId);
  const skip = (page - 1) * limit;
  const [notes, total] = await Promise.all([
    prisma.clinicalNote.findMany({
      where: { patientId },
      orderBy: [{ createdAt: "desc" }],
      skip,
      take: limit,
      select: {
        id: true,
        type: true,
        content: true,
        createdAt: true,
        professional: {
          select: {
            id: true,
            user: { select: { firstName: true, lastName: true } },
          },
        },
      },
    }),
    prisma.clinicalNote.count({ where: { patientId } }),
  ]);
  const totalPages = Math.ceil(total / limit);
  return {
    data: notes,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

export async function listClinicalNotesByProfessional(
  professionalUserId: string | undefined,
  { page, limit }: ClinicalNotePaginationData
): Promise<PaginatedResponse<any>> {
  if (!professionalUserId) throw new AppError("Usuário não encontrado", 404);
  const professional = await prisma.professional.findUnique({
    where: { userId: professionalUserId },
  });
  if (!professional) throw new AppError("Profissional não encontrado", 404);

  const skip = (page - 1) * limit;
  const [notes, total] = await Promise.all([
    prisma.clinicalNote.findMany({
      where: { professionalId: professional.id },
      orderBy: [{ createdAt: "desc" }],
      skip,
      take: limit,
      select: {
        id: true,
        type: true,
        content: true,
        createdAt: true,
        patient: {
          select: {
            id: true,
            user: { select: { firstName: true, lastName: true } },
          },
        },
      },
    }),
    prisma.clinicalNote.count({ where: { professionalId: professional.id } }),
  ]);
  const totalPages = Math.ceil(total / limit);
  return {
    data: notes,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}
