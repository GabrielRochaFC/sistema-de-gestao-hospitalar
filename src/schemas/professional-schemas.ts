import z from "zod";
import { isValidCPF, isValidPhone } from "@brazilian-utils/brazilian-utils";
import { normalizeCPF, normalizePhone } from "@/utils/normalize-data";

export const professionalTypeSchema = z.enum(
  ["DOCTOR", "NURSE", "TECHNICIAN"],
  {
    error: "Tipo de profissional inválido",
  }
);

export const medicalSpecialtySchema = z.enum(
  [
    "GENERAL_PRACTICE",
    "CARDIOLOGY",
    "DERMATOLOGY",
    "EMERGENCY_MEDICINE",
    "FAMILY_MEDICINE",
    "INTERNAL_MEDICINE",
    "NEUROLOGY",
    "OBSTETRICS_GYNECOLOGY",
    "ONCOLOGY",
    "ORTHOPEDICS",
    "PEDIATRICS",
    "PSYCHIATRY",
    "RADIOLOGY",
    "SURGERY",
    "UROLOGY",
  ],
  {
    error: "Especialidade médica inválida",
  }
);

export const createProfessionalSchema = z
  .object({
    firstName: z.string().min(2, "O nome deve ter no mínimo 2 caracteres"),
    lastName: z.string().min(2, "O sobrenome deve ter no mínimo 2 caracteres"),
    email: z.email("Formato de e-mail inválido"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    cpf: z
      .string()
      .transform(normalizeCPF)
      .refine((val) => isValidCPF(val), { error: "CPF inválido" }),
    licenseNumber: z.string().min(1, "Número da licença é obrigatório"),
    type: professionalTypeSchema.default("DOCTOR"),
    specialties: z.array(medicalSpecialtySchema).optional().default([]),
    phone: z
      .string()
      .transform(normalizePhone)
      .refine((val) => isValidPhone(val), { error: "Telefone inválido" })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.type === "DOCTOR") {
        return data.specialties && data.specialties.length > 0;
      }
      return true;
    },
    {
      error: "Médicos devem ter pelo menos uma especialidade",
    }
  );

export type CreateProfessionalData = z.infer<typeof createProfessionalSchema>;
