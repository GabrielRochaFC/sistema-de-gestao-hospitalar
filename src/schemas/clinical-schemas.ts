import z from "zod";
import { paginationSchema } from "./pagination-schemas";

export const clinicalNoteTypeSchema = z.enum([
  "PROGRESS",
  "VITAL_SIGN",
  "OTHER",
]);

export const createClinicalNoteSchema = z.object({
  patientId: z.uuid("ID de paciente inválido"),
  professionalId: z.uuid("ID de profissional inválido").optional(),
  type: clinicalNoteTypeSchema.default("PROGRESS"),
  content: z
    .string()
    .min(3, "Conteúdo deve ter no mínimo 3 caracteres")
    .max(4000, "Conteúdo excede limite de 4000 caracteres"),
});

export const getClinicalNoteIdSchema = z.uuid("ID de nota inválido");

export const listPatientClinicalNotesSchema = paginationSchema;
export const listProfessionalClinicalNotesSchema = paginationSchema;

export type CreateClinicalNoteData = z.infer<typeof createClinicalNoteSchema>;
export type ClinicalNotePaginationData = z.infer<typeof paginationSchema>;
