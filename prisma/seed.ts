import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL!;
  const adminPassword = process.env.ADMIN_PASSWORD!;
  const firstName = process.env.ADMIN_FIRST_NAME!;
  const lastName = process.env.ADMIN_LAST_NAME!;
  const cpf = process.env.ADMIN_CPF!;

  const existingAdmin = await prisma.user.findFirst({
    where: { email: adminEmail, role: { has: "ADMIN" } },
  });

  if (existingAdmin) {
    console.log("Admin já existe.");
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      firstName,
      lastName,
      cpf,
      role: ["ADMIN"],
    },
  });

  console.log("Admin criado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
