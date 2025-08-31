import {
  createAppointmentSchema,
  updateAppointmentSchema,
} from "@/schemas/appointment-schemas";
import {
  cancelAppointment,
  createAppointment,
  updateAppointment,
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

  async updateAppointment(req: Request, res: Response) {
    const { appointmentId } = req.params;

    const appointmentData = updateAppointmentSchema.parse({
      ...req.body,
    });

    const appointment = await updateAppointment(appointmentId, appointmentData);

    return res.status(200).json(appointment);
  }
}
