import { Request, Response } from "express";
import { createPatientSchema } from "@/schemas/patient-schemas";
import { createPatient } from "@/services/patient-service";

export class PatientController {
  async create(req: Request, res: Response) {
    const userId = req.user?.id;
    const patientData = createPatientSchema.parse({
      userId,
      ...req.body,
    });

    const { patient } = await createPatient(patientData);

    return res.status(201).json({ patient });
  }
}
