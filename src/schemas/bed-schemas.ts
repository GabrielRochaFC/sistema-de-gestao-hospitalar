import z from "zod";

export const bedStatusSchema = z.enum(
  ["AVAILABLE", "OCCUPIED", "MAINTENANCE"],
  {
    error:
      "Status da cama inválido. Os status possíveis são: AVAILABLE, OCCUPIED, MAINTENANCE",
  }
);

export const createBedSchema = z.object({
  code: z
    .string()
    .min(2, "O código deve ter no mínimo 2 caracteres")
    .max(50, "O código deve ter no máximo 50 caracteres"),
  unitId: z.coerce.number().int().positive(),
  status: bedStatusSchema.default("AVAILABLE"),
});

export const updateBedSchema = z.object({
  code: z
    .string()
    .min(2, "O código deve ter no mínimo 2 caracteres")
    .max(50, "O código deve ter no máximo 50 caracteres")
    .optional(),
  status: bedStatusSchema.optional(),
  unitId: z.coerce.number().int().positive().optional(),
});

export const getBedIdSchema = z.uuid("ID inválido");
export const getBedByCodeSchema = z.string().min(1, "Código inválido");
export const getBedUnitIdSchema = z.coerce.number().int().positive();

export type CreateBedData = z.infer<typeof createBedSchema>;
export type UpdateBedData = z.infer<typeof updateBedSchema>;
