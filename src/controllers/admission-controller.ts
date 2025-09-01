import { Request, Response } from "express";
import {
  createAdmissionSchema,
  getAdmissionIdSchema,
  dischargeAdmissionSchema,
  cancelAdmissionSchema,
  admissionsPaginationSchema,
} from "@/schemas/admission-schemas";
import {
  createAdmission,
  getAdmissionById,
  listAdmissions,
  dischargeAdmission,
  cancelAdmission,
} from "@/services/admission-service";

export class AdmissionController {
  async create(req: Request, res: Response) {
    const data = createAdmissionSchema.parse(req.body);
    const result = await createAdmission(data);
    return res.status(201).json(result);
  }

  async getById(req: Request, res: Response) {
    const id = getAdmissionIdSchema.parse(req.params.id);
    const result = await getAdmissionById(id);
    return res.status(200).json(result);
  }

  async list(req: Request, res: Response) {
    const { page, limit } = admissionsPaginationSchema.parse(req.query);
    const unitId = Number(req.params.id);
    const result = await listAdmissions(unitId, { page, limit });
    return res.status(200).json(result);
  }

  async discharge(req: Request, res: Response) {
    const id = getAdmissionIdSchema.parse(req.params.id);
    const data = dischargeAdmissionSchema.parse(req.body);
    const result = await dischargeAdmission(id, data);
    return res.status(200).json(result);
  }

  async cancel(req: Request, res: Response) {
    const id = getAdmissionIdSchema.parse(req.params.id);
    const data = cancelAdmissionSchema.parse(req.body);
    const result = await cancelAdmission(id, data);
    return res.status(200).json(result);
  }
}
