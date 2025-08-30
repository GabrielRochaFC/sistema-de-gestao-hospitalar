import { normalizePhone, normalizeZipCode } from "@/utils/normalize-data";
import { isValidCEP, isValidPhone } from "@brazilian-utils/brazilian-utils";
import z from "zod";

const bloodTypeEnum = z.enum(
  ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  {
    error: "Tipo sanguíneo inválido",
  }
);

const addressSchema = z.object({
  street: z.string().min(2, "O nome da rua deve ter no mínimo 2 caracteres"),
  number: z
    .string()
    .min(1, "O número deve ter no mínimo 1 caractere")
    .optional(),
  complement: z
    .string()
    .max(100, "O complemento deve ter no máximo 100 caracteres")
    .optional(),
  city: z.string().min(2, "O nome da cidade deve ter no mínimo 2 caracteres"),
  state: z.string().length(2, "O estado deve ter 2 caracteres"),
  zipCode: z
    .string()
    .transform(normalizeZipCode)
    .refine((val) => isValidCEP(val), {
      error: "O CEP deve estar no formato 00000-000",
    }),
  country: z
    .string()
    .min(2, "O nome do país deve ter no mínimo 2 caracteres")
    .optional(),
});

export const createPatientSchema = z.object({
  userId: z.uuid("ID inválido"),
  address: addressSchema.optional(),
  healthPlan: z
    .string()
    .min(2, "O nome do plano de saúde deve ter no mínimo 2 caracteres")
    .optional(),
  allergies: z
    .array(
      z.string().min(2, "O nome da alergia deve ter no mínimo 2 caracteres")
    )
    .optional()
    .default([]),
  bloodType: bloodTypeEnum.optional(),
  emergencyContact: z
    .string()
    .transform(normalizePhone)
    .refine((val) => isValidPhone(val), { error: "Telefone inválido" })
    .optional(),
});

export type CreatePatientData = z.infer<typeof createPatientSchema>;
