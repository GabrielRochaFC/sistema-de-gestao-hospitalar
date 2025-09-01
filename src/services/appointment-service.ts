import { prisma } from "@/database/prisma";
import {
  CreateAppointmentData,
  UpdateAppointmentData,
} from "@/schemas/appointment-schemas";
import { AppError } from "@/utils/AppError";
import { AppointmentStatus, AppointmentType } from "generated/prisma";

async function findPatientByUserId(userId: string | undefined) {
  if (!userId) {
    throw new AppError("Usuário não encontrado", 404);
  }

  const patient = await prisma.patient.findUnique({
    where: { userId },
  });

  if (!patient) {
    throw new AppError("Paciente não encontrado", 404);
  }

  return patient;
}

export async function createAppointment({
  userId,
  dateTime,
  type,
  medicalSpecialty,
  unitId,
  notes,
}: CreateAppointmentData) {
  const patient = await findPatientByUserId(userId);

  const unit = await prisma.hospitalUnit.findUnique({ where: { id: unitId } });
  if (!unit) {
    throw new AppError("Unidade hospitalar não encontrada", 404);
  }

  const doctor = await prisma.professional.findFirst({
    where: {
      specialties: {
        hasSome: [medicalSpecialty],
      },
      units: {
        some: { id: unitId },
      },
    },
  });

  if (!doctor) {
    throw new AppError(
      "Não foi possível encontrar um médico disponível para a especialidade solicitada",
      404
    );
  }

  const appointment = await prisma.appointment.create({
    data: {
      patientId: patient.id,
      professionalId: doctor.id,
      dateTime,
      type,
      unitId,
      notes,
    },
  });

  return appointment;
}

export async function cancelAppointment(
  appointmentId: string,
  userId: string | undefined
) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) {
    throw new AppError("Consulta não encontrada", 404);
  }

  const patient = await findPatientByUserId(userId);

  if (appointment.patientId !== patient.id) {
    throw new AppError(
      "Você não tem permissão para cancelar esta consulta",
      403
    );
  }

  const updatedAppointment = await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      status: AppointmentStatus.CANCELED,
    },
  });

  return updatedAppointment;
}

export async function findAllPatientAppointments(userId: string | undefined) {
  const patient = await findPatientByUserId(userId);

  const appointments = await prisma.appointment.findMany({
    where: { patientId: patient.id },
    orderBy: [
      {
        status: "asc",
      },
      {
        dateTime: "asc",
      },
    ],
  });

  return appointments;
}

export async function findAllPatientTelemedicineAppointments(
  userId: string | undefined
) {
  const patient = await findPatientByUserId(userId);

  const appointments = await prisma.appointment.findMany({
    where: {
      patientId: patient.id,
      type: AppointmentType.TELEMEDICINE,
    },
    orderBy: [
      {
        status: "asc",
      },
      {
        dateTime: "asc",
      },
    ],
  });

  if (appointments.length === 0) {
    throw new AppError("Nenhuma teleconsulta encontrada", 404);
  }

  return appointments;
}

export async function updateAppointment(
  appointmentId: string,
  data: UpdateAppointmentData
) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) {
    throw new AppError("Consulta não encontrada", 404);
  }

  if (data.unitId) {
    const unit = await prisma.hospitalUnit.findUnique({
      where: { id: data.unitId },
    });
    if (!unit) {
      throw new AppError("Unidade hospitalar não encontrada", 404);
    }
    const professionalWorksThere = await prisma.hospitalUnit.findFirst({
      where: {
        id: data.unitId,
        professionals: { some: { id: appointment.professionalId } },
      },
    });
    if (!professionalWorksThere) {
      throw new AppError(
        "O profissional da consulta não está associado à nova unidade",
        400
      );
    }
  }

  const updatedAppointment = await prisma.appointment.update({
    where: { id: appointmentId },
    data: { ...data },
  });

  return updatedAppointment;
}
