import { Request, Response } from "express";
import { createProfessional } from "@/services/professional-service";
import { findAllProfessionalAppointments } from "@/services/appointment-service";
import { paginationSchema } from "@/schemas/pagination-schemas";
import { examsPaginationSchema } from "@/schemas/exam-schemas";
import { listExamsForProfessional } from "@/services/exam-service";
import { createProfessionalSchema } from "@/schemas/professional-schemas";

export class ProfessionalController {
  async create(req: Request, res: Response) {
    const userId = req.user?.id;

    const professionalData = createProfessionalSchema.parse({
      userId,
      ...req.body,
    });

    const { professional } = await createProfessional(professionalData);

    return res.status(201).json({ professional });
  }

  async findAllAppointments(req: Request, res: Response) {
    const userId = req.user?.id;
    const { page, limit } = paginationSchema.parse(req.query);

    const appointments = await findAllProfessionalAppointments(userId, {
      page,
      limit,
    });

    return res.status(200).json(appointments);
  }

  async findAllExams(req: Request, res: Response) {
    const userId = req.user?.id;
    const { page, limit } = examsPaginationSchema.parse(req.query);
    const exams = await listExamsForProfessional(userId, { page, limit });
    return res.status(200).json(exams);
  }
}
