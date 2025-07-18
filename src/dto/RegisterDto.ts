import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsDateString,
  IsOptional,
  IsEnum,
} from "class-validator";
import { UserRole } from "../entities/User";

export class RegisterDto {
  @IsNotEmpty({ message: "fullName не должен быть пустым" })
  fullName!: string;

  @IsDateString({}, { message: "birthDate должен быть ISO-8601" })
  birthDate!: string;

  @IsEmail({}, { message: "email должен быть валидным" })
  email!: string;

  @MinLength(6, { message: "password минимум 6 символов" })
  password!: string;

  @IsOptional()
  @IsEnum(UserRole, { message: "role должен быть ADMIN или USER" })
  role?: UserRole;
}
