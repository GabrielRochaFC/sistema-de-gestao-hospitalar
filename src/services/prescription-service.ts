import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { PrescriptionStatus } from "generated/prisma";
import {
  CreatePrescriptionData,
  CancelPrescriptionData,
  PrescriptionPaginationData,
} from "@/schemas/prescription-schemas";
import { PaginatedResponse } from "@/schemas/pagination-schemas";

async function ensurePatient(patientId: string) {
  const patient = await prisma.patient.findUnique({ where: { id: patientId } });
  if (!patient) throw new AppError("Paciente não encontrado", 404);
  return patient;
}

async function ensureProfessional(professionalId?: string) {
  if (!professionalId) return;
  const professional = await prisma.professional.findUnique({
    where: { id: professionalId },
  });
  if (!professional) throw new AppError("Profissional não encontrado", 404);
}

export async function createPrescription(data: CreatePrescriptionData) {
  await ensurePatient(data.patientId);
  await ensureProfessional(data.professionalId);

  const prescription = await prisma.prescription.create({
    data: {
      patientId: data.patientId,
      professionalId: data.professionalId,
      notes: data.notes,
      validUntil: data.validUntil,
      items: {
        create: data.items.map((item) => ({
          medicationName: item.medicationName,
          dosage: item.dosage,
          frequency: item.frequency,
          quantity: item.quantity,
          instructions: item.instructions,
        })),
      },
    },
    include: { items: true },
  });
  return { prescription };
}

export async function cancelPrescription(
  id: string,
  data: CancelPrescriptionData
) {
  const prescription = await prisma.prescription.findUnique({ where: { id } });
  if (!prescription) throw new AppError("Prescrição não encontrada", 404);
  if (prescription.status !== PrescriptionStatus.ACTIVE) {
    throw new AppError("Prescrição não pode ser cancelada", 400);
  }
  const updated = await prisma.prescription.update({
    where: { id },
    data: { status: PrescriptionStatus.CANCELED, notes: data.reason },
    include: { items: true },
  });
  return { prescription: updated };
}

export async function listPrescriptionsByPatient(
  patientId: string,
  { page, limit }: PrescriptionPaginationData
): Promise<PaginatedResponse<any>> {
  await ensurePatient(patientId);
  const skip = (page - 1) * limit;
  const [prescriptions, total] = await Promise.all([
    prisma.prescription.findMany({
      where: { patientId },
      orderBy: [{ issuedAt: "desc" }],
      skip,
      take: limit,
      select: {
        id: true,
        status: true,
        issuedAt: true,
        validUntil: true,
        notes: true,
        professional: {
          select: {
            id: true,
            user: { select: { firstName: true, lastName: true } },
          },
        },
        items: {
          select: {
            id: true,
            medicationName: true,
            dosage: true,
            frequency: true,
            quantity: true,
            instructions: true,
          },
        },
      },
    }),
    prisma.prescription.count({ where: { patientId } }),
  ]);
  const totalPages = Math.ceil(total / limit);
  return {
    data: prescriptions,
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

export async function listPrescriptionsByProfessional(
  professionalUserId: string | undefined,
  { page, limit }: PrescriptionPaginationData
): Promise<PaginatedResponse<any>> {
  if (!professionalUserId) throw new AppError("Usuário não encontrado", 404);
  const professional = await prisma.professional.findUnique({
    where: { userId: professionalUserId },
  });
  if (!professional) throw new AppError("Profissional não encontrado", 404);

  const skip = (page - 1) * limit;
  const [prescriptions, total] = await Promise.all([
    prisma.prescription.findMany({
      where: { professionalId: professional.id },
      orderBy: [{ issuedAt: "desc" }],
      skip,
      take: limit,
      select: {
        id: true,
        status: true,
        issuedAt: true,
        validUntil: true,
        notes: true,
        patient: {
          select: {
            id: true,
            user: { select: { firstName: true, lastName: true } },
          },
        },
        items: {
          select: {
            id: true,
            medicationName: true,
            dosage: true,
            frequency: true,
            quantity: true,
            instructions: true,
          },
        },
      },
    }),
    prisma.prescription.count({ where: { professionalId: professional.id } }),
  ]);
  const totalPages = Math.ceil(total / limit);
  return {
    data: prescriptions,
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
