import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { hash } from "bcrypt";
import { Patient, User } from "generated/prisma";

interface CreatePatientRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  cpf: string;
  birthDate?: Date;
  phone?: string;
}

interface CreatePatientResponse {
  user: Omit<User, "password">;
  patient: Patient;
}

export class PatientService {
  async create({
    firstName,
    lastName,
    email,
    password,
    cpf,
    birthDate,
    phone,
  }: CreatePatientRequest): Promise<CreatePatientResponse> {
    await this.validateUserCreation(email, cpf);

    const result = await prisma.$transaction(async (tx) => {
      const hashedPassword = await hash(password, 10);

      const user = await tx.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          cpf,
          role: "PATIENT",
        },
      });

      const patient = await tx.patient.create({
        data: {
          userId: user.id,
          birthDate: birthDate ? new Date(birthDate) : null,
          phone,
        },
      });

      const { password: _, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword,
        patient,
      };
    });

    return result;
  }

  private async validateUserCreation(email: string, cpf: string) {
    const userWithSameEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (userWithSameEmail) {
      throw new AppError("Este e-mail já está em uso", 400);
    }

    const userWithSameCpf = await prisma.user.findUnique({
      where: { cpf },
    });

    if (userWithSameCpf) {
      throw new AppError("Este CPF já está cadastrado", 400);
    }
  }
}
