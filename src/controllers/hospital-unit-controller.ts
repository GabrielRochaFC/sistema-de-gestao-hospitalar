import { Request, Response } from "express";
import {
  addProfessionalToUnitSchema,
  createHospitalUnitSchema,
  getHospitalUnitSchema,
  updateHospitalUnitSchema,
} from "@/schemas/hospital-unit-schemas";
import {
  createHospitalUnit,
  updateHospitalUnit,
  listHospitalUnits,
  addProfessionalToUnit,
  listUnitProfessionals,
  listUnitAppointments,
} from "@/services/hospital-unit-service";
import { paginationSchema } from "@/schemas/pagination-schemas";

export class HospitalUnitController {
  async create(req: Request, res: Response) {
    const unitData = createHospitalUnitSchema.parse(req.body);
    const { unit } = await createHospitalUnit(unitData);
    return res.status(201).json({ unit });
  }

  async update(req: Request, res: Response) {
    const id = getHospitalUnitSchema.parse(req.params.id);
    const data = updateHospitalUnitSchema.parse(req.body);
    const { unit } = await updateHospitalUnit(id, data);
    return res.status(200).json({ unit });
  }

  async index(req: Request, res: Response) {
    const pagination = paginationSchema.parse(req.query);
    const result = await listHospitalUnits(pagination);
    return res.status(200).json(result);
  }

  async addProfessional(req: Request, res: Response) {
    const unitId = getHospitalUnitSchema.parse(req.params.id);
    const data = addProfessionalToUnitSchema.parse(req.body);
    const result = await addProfessionalToUnit(unitId, data);
    return res.status(200).json(result);
  }

  async professionals(req: Request, res: Response) {
    const unitId = getHospitalUnitSchema.parse(req.params.id);
    const pagination = paginationSchema.parse(req.query);
    const result = await listUnitProfessionals(unitId, pagination);
    return res.status(200).json(result);
  }

  async appointments(req: Request, res: Response) {
    const unitId = getHospitalUnitSchema.parse(req.params.id);
    const pagination = paginationSchema.parse(req.query);
    const result = await listUnitAppointments(unitId, pagination);
    return res.status(200).json(result);
  }
}
