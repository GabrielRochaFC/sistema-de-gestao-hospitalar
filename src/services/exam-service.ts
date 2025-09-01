import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { ExamStatus } from "generated/prisma";
import {
  CreateExamData,
  StartExamData,
  CompleteExamData,
  CancelExamData,
  ExamsPaginationData,
  ScheduleExamData,
} from "@/schemas/exam-schemas";
import { PaginatedResponse } from "@/schemas/pagination-schemas";

async function ensurePatientAndUnit(patientId: string, unitId: number) {
  const [patient, unit] = await Promise.all([
    prisma.patient.findUnique({ where: { id: patientId } }),
    prisma.hospitalUnit.findUnique({ where: { id: unitId } }),
  ]);
  if (!patient) throw new AppError("Paciente não encontrado", 404);
  if (!unit) throw new AppError("Unidade hospitalar não encontrada", 404);
}

async function ensureProfessional(professionalId?: string) {
  if (!professionalId) return;
  const professional = await prisma.professional.findUnique({
    where: { id: professionalId },
  });
  if (!professional) throw new AppError("Profissional não encontrado", 404);
}

export async function createExam(data: CreateExamData) {
  await ensurePatientAndUnit(data.patientId, data.unitId);
  await ensureProfessional(data.professionalId);

  const exam = await prisma.exam.create({
    data: {
      patientId: data.patientId,
      unitId: data.unitId,
      type: data.type,
      professionalId: data.professionalId,
      scheduledDate: data.scheduledDate,
      notes: data.notes,
    },
  });
  return { exam };
}

export async function getExamById(id: string) {
  const exam = await prisma.exam.findUnique({
    where: { id },
    include: {
      patient: {
        select: {
          id: true,
          user: { select: { firstName: true, lastName: true } },
        },
      },
      professional: {
        select: {
          id: true,
          user: { select: { firstName: true, lastName: true, email: true } },
        },
      },
      unit: { select: { id: true, name: true } },
    },
  });
  if (!exam) throw new AppError("Exame não encontrado", 404);
  return { exam };
}

export async function listExamsByPatient(
  patientId: string,
  { page, limit }: ExamsPaginationData
): Promise<PaginatedResponse<any>> {
  const skip = (page - 1) * limit;

  const [exams, total] = await Promise.all([
    prisma.exam.findMany({
      where: { patientId },
      orderBy: [{ status: "asc" }, { requestDate: "desc" }],
      skip,
      take: limit,
      select: {
        id: true,
        type: true,
        status: true,
        requestDate: true,
        scheduledDate: true,
        completedDate: true,
        professional: {
          select: {
            id: true,
            user: { select: { firstName: true, lastName: true } },
          },
        },
        unit: { select: { id: true, name: true } },
      },
    }),
    prisma.exam.count({ where: { patientId } }),
  ]);

  const totalPages = Math.ceil(total / limit);
  return {
    data: exams,
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

export async function listExamsByUnit(
  unitId: number,
  { page, limit }: ExamsPaginationData
): Promise<PaginatedResponse<any>> {
  const skip = (page - 1) * limit;

  const [exams, total] = await Promise.all([
    prisma.exam.findMany({
      where: { unitId },
      orderBy: [{ status: "asc" }, { requestDate: "desc" }],
      skip,
      take: limit,
      select: {
        id: true,
        type: true,
        status: true,
        requestDate: true,
        scheduledDate: true,
        completedDate: true,
        patient: {
          select: {
            id: true,
            user: { select: { firstName: true, lastName: true } },
          },
        },
        professional: {
          select: {
            id: true,
            user: { select: { firstName: true, lastName: true } },
          },
        },
      },
    }),
    prisma.exam.count({ where: { unitId } }),
  ]);

  const totalPages = Math.ceil(total / limit);
  return {
    data: exams,
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

async function getUpdatableExam(id: string) {
  const exam = await prisma.exam.findUnique({ where: { id } });
  if (!exam) throw new AppError("Exame não encontrado", 404);
  return exam;
}

export async function scheduleExam(id: string, data: ScheduleExamData) {
  const exam = await getUpdatableExam(id);

  if (exam.status !== ExamStatus.REQUESTED) {
    throw new AppError(
      "Somente exames em estado REQUESTED podem ser agendados",
      400
    );
  }
  await ensureProfessional(data.professionalId);
  const updated = await prisma.exam.update({
    where: { id },
    data: {
      status: ExamStatus.SCHEDULED,
      scheduledDate: data.scheduledDate,
      professionalId: data.professionalId ?? exam.professionalId,
      notes: data.notes ?? exam.notes,
    },
  });
  return { exam: updated };
}

export async function startExam(id: string, data: StartExamData) {
  const exam = await getUpdatableExam(id);
  if (exam.status !== ExamStatus.SCHEDULED) {
    throw new AppError("Somente exames agendados podem ser iniciados", 400);
  }
  const updated = await prisma.exam.update({
    where: { id },
    data: { status: ExamStatus.IN_PROGRESS, notes: data.notes },
  });
  return { exam: updated };
}

export async function completeExam(id: string, data: CompleteExamData) {
  const exam = await getUpdatableExam(id);
  if (exam.status !== ExamStatus.IN_PROGRESS) {
    throw new AppError("Somente exames em andamento podem ser concluídos", 400);
  }
  const updated = await prisma.exam.update({
    where: { id },
    data: {
      status: ExamStatus.COMPLETED,
      completedDate: new Date(),
      resultText: data.resultText,
      notes: data.notes,
    },
  });
  return { exam: updated };
}

export async function cancelExam(id: string, data: CancelExamData) {
  const exam = await getUpdatableExam(id);
  if (
    exam.status === ExamStatus.COMPLETED ||
    exam.status === ExamStatus.CANCELED
  ) {
    throw new AppError("Exame não pode ser cancelado", 400);
  }
  const updated = await prisma.exam.update({
    where: { id },
    data: { status: ExamStatus.CANCELED, notes: data.notes },
  });
  return { exam: updated };
}
