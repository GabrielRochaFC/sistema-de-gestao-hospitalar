import z from "zod";

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
    userId: z.uuid("ID inválido"),
    licenseNumber: z.string().min(1, "Número da licença é obrigatório"),
    type: professionalTypeSchema.default("DOCTOR"),
    specialties: z.array(medicalSpecialtySchema).optional().default([]),
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
