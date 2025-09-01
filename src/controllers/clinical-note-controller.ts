import { Request, Response } from "express";
import {
  createClinicalNoteSchema,
  listPatientClinicalNotesSchema,
  listProfessionalClinicalNotesSchema,
} from "@/schemas/clinical-schemas";
import {
  createClinicalNote,
  listClinicalNotesByPatient,
  listClinicalNotesByProfessional,
} from "@/services/clinical-note-service";

export class ClinicalNoteController {
  async create(req: Request, res: Response) {
    const data = createClinicalNoteSchema.parse(req.body);
    const result = await createClinicalNote(data);
    return res.status(201).json(result);
  }

  async listByPatient(req: Request, res: Response) {
    const patientId = req.params.patientId;
    const { page, limit } = listPatientClinicalNotesSchema.parse(req.query);
    const result = await listClinicalNotesByPatient(patientId, { page, limit });
    return res.status(200).json(result);
  }

  async listByProfessional(req: Request, res: Response) {
    const userId = req.user?.id;
    const { page, limit } = listProfessionalClinicalNotesSchema.parse(
      req.query
    );
    const result = await listClinicalNotesByProfessional(userId, {
      page,
      limit,
    });
    return res.status(200).json(result);
  }
}
