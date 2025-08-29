import z from "zod";
import { isValidCPF, isValidPhone } from "@brazilian-utils/brazilian-utils";

export const createPatientSchema = z.object({
  firstName: z.string().min(2, "O nome deve ter no mínimo 2 caracteres"),
  lastName: z.string().min(2, "O sobrenome deve ter no mínimo 2 caracteres"),
  email: z.email("Formato de e-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  cpf: z.string().refine((val) => isValidCPF(val), { message: "CPF inválido" }),
  birthDate: z.coerce
    .date()
    .max(new Date(), { error: "Muito novo!" })
    .optional(),
  phone: z
    .string()
    .refine((val) => isValidPhone(val), { message: "Telefone inválido" })
    .optional(),
});
