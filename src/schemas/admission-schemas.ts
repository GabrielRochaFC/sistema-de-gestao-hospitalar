import z from "zod";
import { paginationSchema } from "./pagination-schemas";

export const admissionStatusSchema = z.enum(
  ["ACTIVE", "DISCHARGED", "CANCELED"],
  {
    error: "Status de internação inválido",
  }
);

export const createAdmissionSchema = z.object({
  patientId: z.uuid("ID de paciente inválido"),
  bedId: z.uuid("ID de cama inválido"),
  unitId: z.coerce.number().int().positive("ID de unidade inválido"),
  reason: z
    .string()
    .min(3, "Motivo deve ter no mínimo 3 caracteres")
    .max(500, "Motivo deve ter no máximo 500 caracteres"),
});

export const getAdmissionIdSchema = z.uuid("ID de internação inválido");

export const dischargeAdmissionSchema = z.object({
  endDate: z.coerce.date().optional(),
});

export const cancelAdmissionSchema = z.object({
  reason: z
    .string()
    .min(3, "Motivo deve ter no mínimo 3 caracteres")
    .max(500, "Motivo deve ter no máximo 500 caracteres")
    .optional(),
});

export const admissionsPaginationSchema = paginationSchema;

export type CreateAdmissionData = z.infer<typeof createAdmissionSchema>;
export type DischargeAdmissionData = z.infer<typeof dischargeAdmissionSchema>;
export type CancelAdmissionData = z.infer<typeof cancelAdmissionSchema>;
export type AdmissionsPaginationData = z.infer<
  typeof admissionsPaginationSchema
>;
