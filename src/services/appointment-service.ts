import { prisma } from "@/database/prisma";
import { CreateAppointmentData } from "@/schemas/appointment-schemas";
import { AppError } from "@/utils/AppError";

async function findPatientByUserId(userId: string) {
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
