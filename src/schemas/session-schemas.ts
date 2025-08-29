import z from "zod";

export const createSessionSchema = z.object({
  email: z.email("Formato de e-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});
