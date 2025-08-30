import { normalizeCPF, normalizePhone } from "@/utils/normalize-data";
import { isValidCPF, isValidPhone } from "@brazilian-utils/brazilian-utils";
import z from "zod";

export const createUserSchema = z.object({
  firstName: z.string().min(2, "O nome deve ter no mínimo 2 caracteres"),
  lastName: z.string().min(2, "O sobrenome deve ter no mínimo 2 caracteres"),
  email: z.email("Formato de e-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  cpf: z
    .string()
    .transform(normalizeCPF)
    .refine((val) => isValidCPF(val), { error: "CPF inválido" }),
  phone: z
    .string()
    .transform(normalizePhone)
    .refine((val) => isValidPhone(val), { error: "Telefone inválido" })
    .optional(),
  birthDate: z.coerce
    .date()
    .max(new Date(), { error: "Data de nascimento não pode ser no futuro" })
    .optional(),
});

export const getUserSchema = z.uuid("ID inválido");

export type CreateUserData = z.infer<typeof createUserSchema>;
export type GetUserData = z.infer<typeof getUserSchema>;
