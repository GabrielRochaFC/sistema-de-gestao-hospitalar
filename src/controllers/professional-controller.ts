import { Request, Response } from "express";
import { createProfessional } from "@/services/professional-service";
import { createProfessionalSchema } from "@/schemas/professional-schemas";

export class ProfessionalController {
  async create(req: Request, res: Response) {
    const professionalData = createProfessionalSchema.parse(req.body);

    const { user, professional } = await createProfessional(professionalData);

    return res.status(201).json({ user, professional });
  }
}
