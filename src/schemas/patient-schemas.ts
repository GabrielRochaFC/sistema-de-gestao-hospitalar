import z from "zod";

export const createPatientSchema = z.object({
  userId: z.uuid("ID inválido"),
  birthDate: z.coerce
    .date()
    .max(new Date(), { error: "Data de nascimento não pode ser no futuro" })
    .optional(),
});

export type CreatePatientData = z.infer<typeof createPatientSchema>;
