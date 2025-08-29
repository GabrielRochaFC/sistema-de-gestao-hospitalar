import { Request, Response } from "express";
import { PatientService } from "@/services/patient-service";
import { createPatientSchema } from "@/schemas/patient-schemas";

export class PatientController {
  async create(req: Request, res: Response) {
    const patientData = createPatientSchema.parse(req.body);

    const patientService = new PatientService();
    const { user, patient } = await patientService.create(patientData);

    return res.status(201).json({ user, patient });
  }
}
