import { prisma } from "@/database/prisma";
import { CreateAppointmentData } from "@/schemas/appointment-schemas";
import { AppError } from "@/utils/AppError";
import { AppointmentStatus } from "generated/prisma";

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
  notes,
}: CreateAppointmentData) {
  const patient = await findPatientByUserId(userId);

  const doctor = await prisma.professional.findFirst({
    where: {
      specialties: {
        hasSome: [medicalSpecialty],
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
