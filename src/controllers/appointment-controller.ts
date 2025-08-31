import { createAppointmentSchema } from "@/schemas/appointment-schemas";
import { createAppointment } from "@/services/appointment-service";
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
}
