import { Request, Response } from "express";
import {
  createPrescriptionSchema,
  getPrescriptionIdSchema,
  cancelPrescriptionSchema,
  listPatientPrescriptionsSchema,
  listProfessionalPrescriptionsSchema,
} from "@/schemas/prescription-schemas";
import {
  createPrescription,
  cancelPrescription,
  listPrescriptionsByPatient,
  listPrescriptionsByProfessional,
} from "@/services/prescription-service";

export class PrescriptionController {
  async create(req: Request, res: Response) {
    const data = createPrescriptionSchema.parse(req.body);
    const result = await createPrescription(data);
    return res.status(201).json(result);
  }

  async cancel(req: Request, res: Response) {
    const id = getPrescriptionIdSchema.parse(req.params.id);
    const data = cancelPrescriptionSchema.parse(req.body);
    const result = await cancelPrescription(id, data);
    return res.status(200).json(result);
  }

  async listByPatient(req: Request, res: Response) {
    const patientId = req.params.patientId;
    const { page, limit } = listPatientPrescriptionsSchema.parse(req.query);
    const result = await listPrescriptionsByPatient(patientId, { page, limit });
    return res.status(200).json(result);
  }

  async listByProfessional(req: Request, res: Response) {
    const userId = req.user?.id;
    const { page, limit } = listProfessionalPrescriptionsSchema.parse(
      req.query
    );
    const result = await listPrescriptionsByProfessional(userId, {
      page,
      limit,
    });
    return res.status(200).json(result);
  }
}
