import prisma from "../prismaClient";
import { IUserRepository } from "./IUserRepository";
import { UserRole, UserStatus } from "../entities/User";
import { User as UserEntity } from "@prisma/client";

export class PrismaUserRepository implements IUserRepository {
  async create(data: {
    fullName: string;
    birthDate: Date;
    email: string;
    passwordHash: string;
    role?: UserRole;
    status?: UserStatus;
  }): Promise<UserEntity> {
    return prisma.user.create({
      data: {
        fullName: data.fullName,
        birthDate: data.birthDate,
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role,
        status: data.status,
      },
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<UserEntity | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findAll(): Promise<UserEntity[]> {
    return prisma.user.findMany();
  }

  async updateStatus(id: string, status: UserStatus): Promise<void> {
    await prisma.user.update({ where: { id }, data: { status } });
  }
}
