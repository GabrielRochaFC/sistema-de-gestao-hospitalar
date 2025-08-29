import { Request, Response } from "express";
import { createPatientSchema } from "@/schemas/patient-schemas";
import { createPatient } from "@/services/patient-service";

export class PatientController {
  async create(req: Request, res: Response) {
    const patientData = createPatientSchema.parse(req.body);

    const { user, patient } = await createPatient(patientData);

    return res.status(201).json({ user, patient });
  }
}
