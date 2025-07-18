import { IUserService, RegisterDTO } from "./IUserService";
import { IUserRepository } from "../repositories/IUserRepository";
import { UserRole, UserStatus } from "../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User as UserEntity } from "@prisma/client";

export class UserService implements IUserService {
  constructor(private userRepo: IUserRepository) {}

  async register(data: RegisterDTO): Promise<UserEntity> {
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) {
      throw new Error("Email already in use");
    }
    // Парсим строку в Date и валидируем
    const birthDateObj = new Date(data.birthDate);
    if (isNaN(birthDateObj.getTime())) {
      throw new Error(
        "Invalid birthDate format. Expected ISO-8601 Date string.",
      );
    }

    const hash = await bcrypt.hash(data.password, 10);
    const user = await this.userRepo.create({
      fullName: data.fullName,
      birthDate: birthDateObj,
      email: data.email,
      passwordHash: hash,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
    });
    return user;
  }

  async authenticate(email: string, password: string): Promise<string> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }
    // запретить логин заблокированным
    if (user.status !== UserStatus.ACTIVE) {
      const err = new Error("User is blocked");
      (err as any).status = 401;
      throw err;
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new Error("Invalid credentials");
    }
    return jwt.sign(
      { sub: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" },
    );
  }

  async getById(requestorId: string, targetId: string): Promise<UserEntity> {
    const requester = await this.userRepo.findById(requestorId);
    if (!requester) throw new Error("Unauthorized");
    if (requester.role !== UserRole.ADMIN && requestorId !== targetId) {
      throw new Error("Forbidden");
    }
    const user = await this.userRepo.findById(targetId);
    if (!user) throw new Error("User not found");
    return user;
  }

  async listAll(requestorId: string): Promise<UserEntity[]> {
    const requester = await this.userRepo.findById(requestorId);
    if (!requester || requester.role !== UserRole.ADMIN) {
      throw new Error("Forbidden");
    }
    return this.userRepo.findAll();
  }

  async block(requestorId: string, targetId: string): Promise<void> {
    const requester = await this.userRepo.findById(requestorId);
    if (!requester) throw new Error("Unauthorized");
    if (requester.role !== UserRole.ADMIN && requestorId !== targetId) {
      throw new Error("Forbidden");
    }
    await this.userRepo.updateStatus(targetId, UserStatus.BLOCKED);
  }
}
