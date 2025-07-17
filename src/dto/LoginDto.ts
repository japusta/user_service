import { IsEmail, MinLength } from "class-validator";

export class LoginDto {
  @IsEmail({}, { message: "email должен быть валидным" })
  email!: string;

  @MinLength(6, { message: "password минимум 6 символов" })
  password!: string;
}
