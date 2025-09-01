import { Request, Response } from "express";
import {
  createBedSchema,
  getBedIdSchema,
  getBedUnitIdSchema,
  updateBedSchema,
} from "@/schemas/bed-schemas";
import { paginationSchema } from "@/schemas/pagination-schemas";
import {
  createBed,
  updateBed,
  getBedById,
  getBedsByUnit,
  deleteBed,
} from "@/services/bed-service";

export class BedController {
  async create(req: Request, res: Response) {
    const data = createBedSchema.parse(req.body);
    const { bed } = await createBed(data);
    return res.status(201).json({ bed });
  }

  async update(req: Request, res: Response) {
    const id = getBedIdSchema.parse(req.params.id);
    const data = updateBedSchema.parse(req.body);
    const { bed } = await updateBed(id, data);
    return res.status(200).json({ bed });
  }

  async findById(req: Request, res: Response) {
    const id = getBedIdSchema.parse(req.params.id);
    const { bed } = await getBedById(id);
    return res.status(200).json({ bed });
  }

  async findByUnit(req: Request, res: Response) {
    const unitId = getBedUnitIdSchema.parse(req.params.unitId);
    const pagination = paginationSchema.parse(req.query);
    const beds = await getBedsByUnit(unitId, pagination);
    return res.status(200).json(beds);
  }

  async delete(req: Request, res: Response) {
    const id = getBedIdSchema.parse(req.params.id);
    await deleteBed(id);
    return res.status(204).json();
  }
}
