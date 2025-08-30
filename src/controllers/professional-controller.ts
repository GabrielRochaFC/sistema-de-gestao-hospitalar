import { Request, Response } from "express";
import { createProfessional } from "@/services/professional-service";
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
}
