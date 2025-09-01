import z from "zod";
import { paginationSchema } from "./pagination-schemas";

export const prescriptionStatusSchema = z.enum(["ACTIVE", "CANCELED"]);

export const createPrescriptionSchema = z.object({
  patientId: z.uuid("ID de paciente inválido"),
  professionalId: z.uuid("ID de profissional inválido").optional(),
  notes: z.string().max(1000).optional(),
  validUntil: z.coerce.date().optional(),
  items: z
    .array(
      z.object({
        medicationName: z
          .string()
          .min(2, "Nome do medicamento muito curto")
          .max(120, "Nome do medicamento muito longo"),
        dosage: z.string().max(120).optional(),
        frequency: z.string().max(120).optional(),
        quantity: z.number().int().positive().optional(),
        instructions: z.string().max(500).optional(),
      })
    )
    .min(1, "Ao menos 1 item de prescrição"),
});

export const getPrescriptionIdSchema = z.uuid("ID de prescrição inválido");

export const cancelPrescriptionSchema = z.object({
  reason: z.string().max(500).optional(),
});

export const listPatientPrescriptionsSchema = paginationSchema;
export const listProfessionalPrescriptionsSchema = paginationSchema;

export type CreatePrescriptionData = z.infer<typeof createPrescriptionSchema>;
export type CancelPrescriptionData = z.infer<typeof cancelPrescriptionSchema>;
export type PrescriptionPaginationData = z.infer<typeof paginationSchema>;
