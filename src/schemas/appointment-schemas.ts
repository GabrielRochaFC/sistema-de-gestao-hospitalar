import z from "zod";
import { medicalSpecialtySchema } from "./professional-schemas";

export const appointmentStatusSchema = z.enum(
  ["SCHEDULED", "COMPLETED", "CANCELED", "NO_SHOW"],
  {
    error: "Status do agendamento inválido",
  }
);

export const appointmentTypeSchema = z.enum(["IN_PERSON", "TELEMEDICINE"], {
  error: "Tipo de agendamento inválido",
});

export const createAppointmentSchema = z.object({
  userId: z.uuid("ID do usuário inválido"),
  dateTime: z.coerce
    .date()
    .min(new Date(), { error: "Data e hora devem ser no futuro" }),
  type: appointmentTypeSchema.default("IN_PERSON"),
  medicalSpecialty: medicalSpecialtySchema,
  notes: z
    .string()
    .max(500, "Observações devem ter no máximo 500 caracteres")
    .optional(),
});

export const updateAppointmentSchema = z.object({
  dateTime: z.coerce
    .date()
    .min(new Date(), { error: "Data e hora devem ser no futuro" })
    .optional(),
  type: appointmentTypeSchema.default("IN_PERSON").optional(),
  medicalSpecialty: medicalSpecialtySchema.optional(),
  status: appointmentStatusSchema.optional(),
  notes: z
    .string()
    .max(500, "Observações devem ter no máximo 500 caracteres")
    .optional(),
});

export type CreateAppointmentData = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentData = z.infer<typeof updateAppointmentSchema>;
