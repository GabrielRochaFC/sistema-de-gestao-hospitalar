import { prisma } from "@/database/prisma";
import {
  CreateUserData,
  UpdateUserData,
  UpdateUserStatusData,
} from "@/schemas/user-schemas";
import {
  PaginationData,
  PaginatedResponse,
} from "@/schemas/pagination-schemas";
import { AppError } from "@/utils/AppError";
import { hash } from "bcrypt";
import { User } from "generated/prisma";

interface CreateUserResponse {
  user: Omit<User, "password" | "role">;
}

async function validateUserCreation(email: string, cpf: string) {
  const userWithSameEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (userWithSameEmail) {
    throw new AppError("E-mail já cadastrado no sistema", 400);
  }

  const userWithSameCpf = await prisma.user.findUnique({
    where: { cpf },
  });

  if (userWithSameCpf) {
    throw new AppError("CPF já cadastrado no sistema", 400);
  }
}

export async function createUser({
  firstName,
  lastName,
  email,
  password,
  cpf,
  phone,
  birthDate,
}: CreateUserData): Promise<CreateUserResponse> {
  await validateUserCreation(email, cpf);

  const hashedPassword = await hash(password, 10);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      cpf,
      role: [],
      phone,
      birthDate,
    },
  });

  const { password: _, role: __, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
  };
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: {
      id,
      status: true,
    },
    include: {
      patient: true,
      professional: true,
    },
  });

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function getAllUsers({
  page,
  limit,
}: PaginationData): Promise<PaginatedResponse<any>> {
  const skip = (page - 1) * limit;

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where: {
        status: true,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        cpf: true,
        phone: true,
        birthDate: true,
        status: true,
        patient: {
          select: {
            id: true,
            healthPlan: true,
            allergies: true,
            bloodType: true,
            emergencyContact: true,
          },
        },
        professional: {
          select: {
            id: true,
            specialties: true,
            licenseNumber: true,
            type: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.user.count({
      where: {
        status: true,
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    data: users,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: totalCount,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

export async function updateUser(id: string, data: UpdateUserData) {
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new AppError("Usuário não encontrado", 404);
  }

  if (data.email) {
    const userWithSameEmail = await prisma.user.findFirst({
      where: {
        email: data.email,
        id: { not: id },
      },
    });

    if (userWithSameEmail) {
      throw new AppError("E-mail já cadastrado no sistema", 400);
    }
  }

  if (data.cpf) {
    const userWithSameCpf = await prisma.user.findFirst({
      where: {
        cpf: data.cpf,
        id: { not: id },
      },
    });

    if (userWithSameCpf) {
      throw new AppError("CPF já cadastrado no sistema", 400);
    }
  }

  const updateData: any = { ...data };

  if (data.password) {
    updateData.password = await hash(data.password, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData,
    include: {
      patient: true,
      professional: true,
    },
  });

  const { password: _, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
}

export async function deleteUser(id: string) {
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new AppError("Usuário não encontrado", 404);
  }

  if (!existingUser.status) {
    throw new AppError("Usuário já está inativo", 400);
  }

  await prisma.user.update({
    where: { id },
    data: { status: false },
  });

  return { message: "Usuário desativado com sucesso" };
}

export async function updateUserStatus(
  id: string,
  { status }: UpdateUserStatusData
) {
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new AppError("Usuário não encontrado", 404);
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { status },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      cpf: true,
      phone: true,
      birthDate: true,
      status: true,
    },
  });

  return {
    user: updatedUser,
    message: status
      ? "Usuário reativado com sucesso"
      : "Usuário desativado com sucesso",
  };
}

export async function getAllUsersWithInactive({
  page,
  limit,
}: PaginationData): Promise<PaginatedResponse<any>> {
  const skip = (page - 1) * limit;

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        cpf: true,
        phone: true,
        birthDate: true,
        status: true,
        patient: {
          select: {
            id: true,
            healthPlan: true,
            allergies: true,
            bloodType: true,
            emergencyContact: true,
          },
        },
        professional: {
          select: {
            id: true,
            specialties: true,
            licenseNumber: true,
            type: true,
          },
        },
      },
      orderBy: {
        status: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.user.count(),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    data: users,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: totalCount,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}
