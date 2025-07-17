import { Request, Response, NextFunction } from "express";
import { IUserService } from "../services/IUserService";

export class UserController {
  constructor(private userService: IUserService) {}

  // Регистрация
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.register(req.body);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  };

  // Логин
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = await this.userService.authenticate(
        req.body.email,
        req.body.password,
      );
      res.json({ token });
    } catch (err) {
      next(err);
    }
  };

  // Получить пользователя по ID
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // берём id текущего пользователя из res.locals.user
      const { id: currentUserId } = res.locals.user as { id: string };
      const user = await this.userService.getById(currentUserId, req.params.id);
      res.json(user);
    } catch (err) {
      next(err);
    }
  };

  // Список всех пользователей (admin)
  listAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: currentUserId } = res.locals.user as { id: string };
      const users = await this.userService.listAll(currentUserId);
      res.json(users);
    } catch (err) {
      next(err);
    }
  };

  // Блокировка пользователя
  block = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: currentUserId } = res.locals.user as { id: string };
      await this.userService.block(currentUserId, req.params.id);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  };
}
