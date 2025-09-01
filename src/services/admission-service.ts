import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { AdmissionStatus, BedStatus } from "generated/prisma";
import {
  CreateAdmissionData,
  DischargeAdmissionData,
  CancelAdmissionData,
  AdmissionsPaginationData,
} from "@/schemas/admission-schemas";
import {
  PaginatedResponse,
  PaginationData,
} from "@/schemas/pagination-schemas";

async function validateEntities(
  patientId: string,
  bedId: string,
  unitId: number
) {
  const [patient, bed, unit] = await Promise.all([
    prisma.patient.findUnique({ where: { id: patientId } }),
    prisma.bed.findFirst({ where: { id: bedId, deletedAt: null } }),
    prisma.hospitalUnit.findUnique({ where: { id: unitId } }),
  ]);

  if (!patient) throw new AppError("Paciente não encontrado", 404);
  if (!bed) throw new AppError("Cama não encontrada", 404);
  if (!unit) throw new AppError("Unidade hospitalar não encontrada", 404);
  if (bed.unitId !== unitId) {
    throw new AppError(
      "A cama selecionada não pertence à unidade informada",
      400
    );
  }
  if (bed.status !== BedStatus.AVAILABLE) {
    throw new AppError("A cama não está disponível", 400);
  }
}

export async function createAdmission(data: CreateAdmissionData) {
  await validateEntities(data.patientId, data.bedId, data.unitId);

  const activeAdmission = await prisma.admission.findFirst({
    where: { patientId: data.patientId, status: AdmissionStatus.ACTIVE },
  });
  if (activeAdmission) {
    throw new AppError("Paciente já possui uma internação ativa", 400);
  }

  const admission = await prisma.$transaction(async (tx) => {
    const created = await tx.admission.create({
      data: {
        reason: data.reason,
        patientId: data.patientId,
        bedId: data.bedId,
        unitId: data.unitId,
      },
    });

    await tx.bed.update({
      where: { id: data.bedId },
      data: { status: BedStatus.OCCUPIED },
    });

    return created;
  });

  return { admission };
}

export async function getAdmissionById(id: string) {
  const admission = await prisma.admission.findUnique({
    where: { id },
    include: {
      patient: {
        select: {
          id: true,
          user: { select: { firstName: true, lastName: true } },
        },
      },
      bed: { select: { id: true, code: true } },
      unit: { select: { id: true, name: true } },
    },
  });
  if (!admission) throw new AppError("Internação não encontrada", 404);
  return { admission };
}

export async function listAdmissions(
  unitId: number,
  { page, limit }: AdmissionsPaginationData
): Promise<PaginatedResponse<any>> {
  if (!unitId || Number.isNaN(unitId)) {
    throw new AppError("ID de unidade inválido", 400);
  }
  const unitExists = await prisma.hospitalUnit.findUnique({
    where: { id: unitId },
  });
  if (!unitExists) {
    throw new AppError("Unidade hospitalar não encontrada", 404);
  }
  const skip = (page - 1) * limit;
  const where = { unitId };

  const [admissions, total] = await Promise.all([
    prisma.admission.findMany({
      where,
      orderBy: [{ status: "asc" }, { startDate: "desc" }],
      skip,
      take: limit,
      select: {
        id: true,
        reason: true,
        startDate: true,
        endDate: true,
        status: true,
        patient: {
          select: {
            id: true,
            user: { select: { firstName: true, lastName: true } },
          },
        },
        bed: { select: { id: true, code: true } },
        unit: { select: { id: true, name: true } },
      },
    }),
    prisma.admission.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);
  return {
    data: admissions,
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

async function getUpdatableAdmission(id: string) {
  const admission = await prisma.admission.findUnique({ where: { id } });
  if (!admission) throw new AppError("Internação não encontrada", 404);
  if (admission.status !== AdmissionStatus.ACTIVE) {
    throw new AppError("Somente internações ativas podem ser modificadas", 400);
  }
  return admission;
}

export async function dischargeAdmission(
  id: string,
  data: DischargeAdmissionData
) {
  const admission = await getUpdatableAdmission(id);

  const endDate = data.endDate ?? new Date();
  if (endDate < admission.startDate) {
    throw new AppError("Data de alta não pode ser anterior ao início", 400);
  }

  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.admission.update({
      where: { id },
      data: { status: AdmissionStatus.DISCHARGED, endDate },
    });

    await tx.bed.update({
      where: { id: admission.bedId },
      data: { status: BedStatus.AVAILABLE },
    });

    return result;
  });

  return { admission: updated, message: "Alta registrada com sucesso" };
}

export async function cancelAdmission(id: string, data: CancelAdmissionData) {
  const admission = await getUpdatableAdmission(id);

  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.admission.update({
      where: { id },
      data: { status: AdmissionStatus.CANCELED, endDate: new Date() },
    });

    await tx.bed.update({
      where: { id: admission.bedId },
      data: { status: BedStatus.AVAILABLE },
    });

    return result;
  });

  return { admission: updated, message: "Internação cancelada com sucesso" };
}
