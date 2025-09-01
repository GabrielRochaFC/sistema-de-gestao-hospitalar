import { Request, Response } from "express";
import { createPatientSchema } from "@/schemas/patient-schemas";
import {
  createPatient,
  listPatientUserExams,
} from "@/services/patient-service";
import {
  findAllPatientAppointments,
  findAllPatientTelemedicineAppointments,
} from "@/services/appointment-service";
import { examsPaginationSchema } from "@/schemas/exam-schemas";

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

  async findAllAppointments(req: Request, res: Response) {
    const userId = req.user?.id;

    const appointments = await findAllPatientAppointments(userId);

    return res.status(200).json(appointments);
  }

  async findAllTelemedicineAppointments(req: Request, res: Response) {
    const userId = req.user?.id;

    const appointments = await findAllPatientTelemedicineAppointments(userId);

    return res.status(200).json(appointments);
  }

  async findAllExams(req: Request, res: Response) {
    const userId = req.user?.id;
    const { page, limit } = examsPaginationSchema.parse(req.query);
    const exams = await listPatientUserExams(userId, { page, limit });
    return res.status(200).json(exams);
  }
}
