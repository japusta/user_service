// src/middlewares/adminMiddleware.ts
import { Request, Response, NextFunction } from "express";

export function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // берём пользователя из res.locals, а не из req.user
  const user = res.locals.user as { id: string; role: string };
  if (!user || user.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden: admin only" });
  }
  next();
}
