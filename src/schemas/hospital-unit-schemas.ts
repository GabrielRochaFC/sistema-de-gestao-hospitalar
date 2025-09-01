import z from "zod";
import { isValidPhone } from "@brazilian-utils/brazilian-utils";
import { normalizePhone } from "@/utils/normalize-data";

export const unitTypeSchema = z.enum(
  ["HOSPITAL", "CLINIC", "LABORATORY", "HOME_CARE"],
  {
    error: "Tipo de unidade inválido",
  }
);

export const createHospitalUnitSchema = z.object({
  name: z
    .string()
    .min(2, "O nome da unidade deve ter no mínimo 2 caracteres")
    .max(100, "O nome da unidade deve ter no máximo 100 caracteres"),
  type: unitTypeSchema,
  phone: z
    .string()
    .transform((val) => normalizePhone(val))
    .refine((val) => (val ? isValidPhone(val) : true), {
      message: "Telefone inválido",
    })
    .optional(),
});

export const updateHospitalUnitSchema = z.object({
  name: z
    .string()
    .min(2, "O nome da unidade deve ter no mínimo 2 caracteres")
    .max(100, "O nome da unidade deve ter no máximo 100 caracteres")
    .optional(),
  type: unitTypeSchema.optional(),
  phone: z
    .string()
    .transform((val) => normalizePhone(val))
    .refine((val) => (val ? isValidPhone(val) : true), {
      message: "Telefone inválido",
    })
    .optional(),
});

export const getHospitalUnitSchema = z.coerce.number().int().positive();

export const addProfessionalToUnitSchema = z.object({
  professionalId: z.uuid("ID do profissional inválido"),
});

export type AddProfessionalToUnitData = z.infer<
  typeof addProfessionalToUnitSchema
>;

export type CreateHospitalUnitData = z.infer<typeof createHospitalUnitSchema>;
export type UpdateHospitalUnitData = z.infer<typeof updateHospitalUnitSchema>;
