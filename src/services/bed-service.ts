import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { CreateBedData, UpdateBedData } from "@/schemas/bed-schemas";
import {
  PaginationData,
  PaginatedResponse,
} from "@/schemas/pagination-schemas";

export async function createBed(data: CreateBedData) {
  const unit = await prisma.hospitalUnit.findUnique({
    where: { id: data.unitId },
  });
  if (!unit) {
    throw new AppError("Unidade hospitalar não encontrada", 404);
  }

  const existingCode = await prisma.bed.findUnique({
    where: { code: data.code },
  });
  if (existingCode) {
    throw new AppError("Já existe uma cama com este código", 400);
  }

  const bed = await prisma.bed.create({ data });
  return { bed };
}

export async function updateBed(id: string, data: UpdateBedData) {
  const existing = await prisma.bed.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) {
    throw new AppError("Cama não encontrada", 404);
  }

  if (data.code && data.code !== existing.code) {
    const codeInUse = await prisma.bed.findFirst({
      where: { code: data.code, deletedAt: null, id: { not: id } },
    });
    if (codeInUse) {
      throw new AppError("Já existe uma cama com este código", 400);
    }
  }

  if (data.unitId) {
    const unit = await prisma.hospitalUnit.findUnique({
      where: { id: data.unitId },
    });
    if (!unit) {
      throw new AppError("Unidade hospitalar não encontrada", 404);
    }
  }

  const bed = await prisma.bed.update({ where: { id }, data });
  return { bed };
}

export async function getBedById(id: string) {
  const bed = await prisma.bed.findFirst({
    where: { id, deletedAt: null },
    include: { unit: true },
  });
  if (!bed) {
    throw new AppError("Cama não encontrada", 404);
  }
  return { bed };
}

export async function getBedsByUnit(
  unitId: number,
  { page, limit }: PaginationData
): Promise<PaginatedResponse<any>> {
  const unit = await prisma.hospitalUnit.findUnique({ where: { id: unitId } });
  if (!unit) {
    throw new AppError("Unidade hospitalar não encontrada", 404);
  }

  const skip = (page - 1) * limit;

  const [beds, totalCount] = await Promise.all([
    prisma.bed.findMany({
      where: { unitId, deletedAt: null },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.bed.count({ where: { unitId, deletedAt: null } }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    data: beds,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: totalCount,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

export async function deleteBed(id: string) {
  const existing = await prisma.bed.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) {
    throw new AppError("Cama não encontrada", 404);
  }
  await prisma.bed.update({ where: { id }, data: { deletedAt: new Date() } });
  return { message: "Cama removida com sucesso" };
}
