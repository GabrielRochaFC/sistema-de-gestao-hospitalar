import { createAppointmentSchema } from "@/schemas/appointment-schemas";
import {
  cancelAppointment,
  createAppointment,
} from "@/services/appointment-service";
import { Request, Response } from "express";

export class AppointmentController {
  async create(req: Request, res: Response) {
    const userId = req.user?.id;
    const appointmentData = createAppointmentSchema.parse({
      userId,
      ...req.body,
    });

    const appointment = await createAppointment(appointmentData);

    return res.status(201).json(appointment);
  }

  async cancelAppointment(req: Request, res: Response) {
    const userId = req.user?.id;
    const { appointmentId } = req.params;

    const appointment = await cancelAppointment(appointmentId, userId);

    return res.status(200).json(appointment);
  }
}
