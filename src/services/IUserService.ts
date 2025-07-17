import { User as UserEntity } from "@prisma/client";

/** DTO для регистрации нового пользователя */
export interface RegisterDTO {
  fullName: string;
  birthDate: string; // ISO-8601 строка даты
  email: string;
  password: string;
}

/** Сервис для работы с пользователями */
export interface IUserService {
  /**
   * Регистрация нового пользователя
   * @throws Error если email уже занят или некорректная дата
   */
  register(data: RegisterDTO): Promise<UserEntity>;

  /**
   * Аутентификация (логин), возвращает JWT
   * @throws Error при неверных учётных данных
   */
  authenticate(email: string, password: string): Promise<string>;

  /**
   * Получение пользователя по ID
   * @throws Error при отсутствии доступа или если не найден
   */
  getById(requestorId: string, targetId: string): Promise<UserEntity>;

  /**
   * Получение списка всех пользователей (только для admin)
   * @throws Error если нет доступа
   */
  listAll(requestorId: string): Promise<UserEntity[]>;

  /**
   * Блокировка пользователя (admin или self)
   * @throws Error при недостатке прав или неверном ID
   */
  block(requestorId: string, targetId: string): Promise<void>;
}
