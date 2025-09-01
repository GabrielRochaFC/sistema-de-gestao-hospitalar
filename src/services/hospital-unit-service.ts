import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import {
  CreateHospitalUnitData,
  UpdateHospitalUnitData,
  AddProfessionalToUnitData,
} from "@/schemas/hospital-unit-schemas";
import {
  PaginationData,
  PaginatedResponse,
} from "@/schemas/pagination-schemas";

export async function createHospitalUnit(data: CreateHospitalUnitData) {
  const existing = await prisma.hospitalUnit.findFirst({
    where: { name: data.name },
  });

  if (existing) {
    throw new AppError("Já existe uma unidade com este nome", 400);
  }

  const unit = await prisma.hospitalUnit.create({
    data: {
      name: data.name,
      type: data.type,
      phone: data.phone,
    },
  });

  return { unit };
}

export async function updateHospitalUnit(
  id: number,
  data: UpdateHospitalUnitData
) {
  const existing = await prisma.hospitalUnit.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new AppError("Unidade não encontrada", 404);
  }

  if (data.name && data.name !== existing.name) {
    const nameInUse = await prisma.hospitalUnit.findFirst({
      where: { name: data.name, id: { not: id } },
    });
    if (nameInUse) {
      throw new AppError("Já existe uma unidade com este nome", 400);
    }
  }

  const unit = await prisma.hospitalUnit.update({
    where: { id },
    data,
  });

  return { unit };
}

export async function listHospitalUnits({
  page,
  limit,
}: PaginationData): Promise<PaginatedResponse<any>> {
  const skip = (page - 1) * limit;

  const [units, total] = await Promise.all([
    prisma.hospitalUnit.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.hospitalUnit.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: units,
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

export async function addProfessionalToUnit(
  unitId: number,
  { professionalId }: AddProfessionalToUnitData
) {
  const unit = await prisma.hospitalUnit.findUnique({ where: { id: unitId } });
  if (!unit) {
    throw new AppError("Unidade não encontrada", 404);
  }

  const professional = await prisma.professional.findUnique({
    where: { id: professionalId },
    include: { units: true },
  });
  if (!professional) {
    throw new AppError("Profissional não encontrado", 404);
  }

  const alreadyLinked = await prisma.hospitalUnit.findFirst({
    where: {
      id: unitId,
      professionals: { some: { id: professionalId } },
    },
  });
  if (alreadyLinked) {
    throw new AppError("Profissional já associado à unidade", 400);
  }

  await prisma.hospitalUnit.update({
    where: { id: unitId },
    data: {
      professionals: {
        connect: { id: professionalId },
      },
    },
  });

  return { message: "Profissional adicionado à unidade com sucesso" };
}

export async function listUnitProfessionals(
  unitId: number,
  { page, limit }: PaginationData
) {
  const unit = await prisma.hospitalUnit.findUnique({ where: { id: unitId } });
  if (!unit) {
    throw new AppError("Unidade não encontrada", 404);
  }

  const skip = (page - 1) * limit;
  const [professionals, total] = await Promise.all([
    prisma.professional.findMany({
      where: { units: { some: { id: unitId } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        licenseNumber: true,
        type: true,
        specialties: true,
        user: { select: { firstName: true, lastName: true, email: true } },
      },
    }),
    prisma.professional.count({ where: { units: { some: { id: unitId } } } }),
  ]);

  const totalPages = Math.ceil(total / limit);
  return {
    data: professionals,
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

export async function listUnitAppointments(
  unitId: number,
  { page, limit }: PaginationData
) {
  const unit = await prisma.hospitalUnit.findUnique({ where: { id: unitId } });
  if (!unit) {
    throw new AppError("Unidade não encontrada", 404);
  }

  const skip = (page - 1) * limit;
  const [appointments, total] = await Promise.all([
    prisma.appointment.findMany({
      where: { unitId },
      orderBy: [{ status: "asc" }, { dateTime: "asc" }],
      skip,
      take: limit,
      select: {
        id: true,
        dateTime: true,
        status: true,
        type: true,
        notes: true,
        telemedicineUrl: true,
        patient: {
          select: {
            id: true,
            user: { select: { firstName: true, lastName: true } },
          },
        },
        professional: {
          select: {
            id: true,
            specialties: true,
            user: { select: { firstName: true, lastName: true } },
          },
        },
      },
    }),
    prisma.appointment.count({ where: { unitId } }),
  ]);

  const totalPages = Math.ceil(total / limit);
  return {
    data: appointments,
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
