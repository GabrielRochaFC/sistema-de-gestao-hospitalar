import { Request, Response } from "express";
import {
  createExamSchema,
  getExamIdSchema,
  startExamSchema,
  completeExamSchema,
  cancelExamSchema,
  examsPaginationSchema,
  scheduleExamSchema,
} from "@/schemas/exam-schemas";
import {
  createExam,
  getExamById,
  listExamsByPatient,
  listExamsByUnit,
  startExam,
  completeExam,
  cancelExam,
  scheduleExam,
} from "@/services/exam-service";

export class ExamController {
  async create(req: Request, res: Response) {
    const data = createExamSchema.parse(req.body);
    const result = await createExam(data);
    return res.status(201).json(result);
  }

  async getById(req: Request, res: Response) {
    const id = getExamIdSchema.parse(req.params.id);
    const result = await getExamById(id);
    return res.status(200).json(result);
  }

  async listByPatient(req: Request, res: Response) {
    const patientId = req.params.patientId;
    const { page, limit } = examsPaginationSchema.parse(req.query);
    const result = await listExamsByPatient(patientId, { page, limit });
    return res.status(200).json(result);
  }

  async listByUnit(req: Request, res: Response) {
    const unitId = Number(req.params.unitId);
    const { page, limit } = examsPaginationSchema.parse(req.query);
    const result = await listExamsByUnit(unitId, { page, limit });
    return res.status(200).json(result);
  }

  async start(req: Request, res: Response) {
    const id = getExamIdSchema.parse(req.params.id);
    const data = startExamSchema.parse(req.body);
    const result = await startExam(id, data);
    return res.status(200).json(result);
  }

  async complete(req: Request, res: Response) {
    const id = getExamIdSchema.parse(req.params.id);
    const data = completeExamSchema.parse(req.body);
    const result = await completeExam(id, data);
    return res.status(200).json(result);
  }

  async cancel(req: Request, res: Response) {
    const id = getExamIdSchema.parse(req.params.id);
    const data = cancelExamSchema.parse(req.body);
    const result = await cancelExam(id, data);
    return res.status(200).json(result);
  }

  async schedule(req: Request, res: Response) {
    const id = getExamIdSchema.parse(req.params.id);
    const data = scheduleExamSchema.parse(req.body);
    const result = await scheduleExam(id, data);
    return res.status(200).json(result);
  }
}
