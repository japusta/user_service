import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Мидлвар для валидации DTO-класса
 * @param dtoClass - класс с декораторами class-validator
 */
export function validateDto(dtoClass: any): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Преобразуем plain-object в экземпляр класса
    const input = plainToInstance(dtoClass, req.body);
    // Валидация по декораторам
    const errors: ValidationError[] = await validate(input, {
      whitelist: true, // удаляет свойства без декораторов
      forbidNonWhitelisted: true, // ошибка при лишних полях
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      // Собираем сообщения об ошибках
      const messages = errors
        .map((err) => Object.values(err.constraints || {}).join(", "))
        .join("; ");
      return res.status(400).json({ message: messages });
    }

    // Переписываем body валидированным DTO
    req.body = input;
    next();
  };
}
