import z from "zod";
import { paginationSchema } from "./pagination-schemas";

export const examTypeSchema = z.enum([
  "BLOOD_TEST",
  "URINE_TEST",
  "IMAGING",
  "XRAY",
  "MRI",
  "CT",
  "ULTRASOUND",
  "ECG",
  "BIOPSY",
  "OTHER",
]);

export const createExamSchema = z.object({
  patientId: z.uuid("ID de paciente inválido"),
  unitId: z.coerce.number().int().positive("ID de unidade inválido"),
  type: examTypeSchema,
  professionalId: z.uuid("ID de profissional inválido").optional(),
  scheduledDate: z.coerce.date().optional(),
  notes: z
    .string()
    .max(1000, "Notas deve ter no máximo 1000 caracteres")
    .optional(),
});

export const getExamIdSchema = z.uuid("ID de exame inválido");

export const startExamSchema = z.object({
  notes: z.string().max(1000).optional(),
});

export const completeExamSchema = z.object({
  resultText: z
    .string()
    .min(3, "Resultado deve ter no mínimo 3 caracteres")
    .max(5000, "Resultado excede limite de 5000 caracteres"),
  notes: z.string().max(1000).optional(),
});

export const cancelExamSchema = z.object({
  notes: z.string().max(1000).optional(),
});

export const scheduleExamSchema = z.object({
  scheduledDate: z.coerce.date({ message: "Data inválida" }),
  professionalId: z.uuid("ID de profissional inválido").optional(),
  notes: z.string().max(1000).optional(),
});

export const examsPaginationSchema = paginationSchema;

export type CreateExamData = z.infer<typeof createExamSchema>;
export type StartExamData = z.infer<typeof startExamSchema>;
export type CompleteExamData = z.infer<typeof completeExamSchema>;
export type CancelExamData = z.infer<typeof cancelExamSchema>;
export type ExamsPaginationData = z.infer<typeof examsPaginationSchema>;
export type ScheduleExamData = z.infer<typeof scheduleExamSchema>;
