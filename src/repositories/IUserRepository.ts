import { User as UserEntity } from "@prisma/client";
import { UserRole, UserStatus } from "../entities/User";

export interface IUserRepository {
  /**
   * Создать нового пользователя в БД
   */
  create(data: {
    fullName: string;
    birthDate: Date;
    email: string;
    passwordHash: string;
    role?: UserRole;
    status?: UserStatus;
  }): Promise<UserEntity>;

  /**
   * Найти пользователя по email
   */
  findByEmail(email: string): Promise<UserEntity | null>;

  /**
   * Найти пользователя по ID
   */
  findById(id: string): Promise<UserEntity | null>;

  /**
   * Получить всех пользователей
   */
  findAll(): Promise<UserEntity[]>;

  /**
   * Обновить статус пользователя
   */
  updateStatus(id: string, status: UserStatus): Promise<void>;
}
