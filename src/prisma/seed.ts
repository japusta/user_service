// src/prisma/seed.ts
import dotenv from "dotenv";
dotenv.config();

import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      fullName: "Admin User",
      birthDate: new Date("1980-01-01"),
      email: "admin@example.com",
      passwordHash: hash,
      role: UserRole.ADMIN,
      status: "ACTIVE",
    },
  });
  console.log("👑 Admin created or updated");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
