// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Token error" });
  }

  const token = parts[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    // вместо req.user:
    res.locals.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ message: "Token invalid" });
  }
}
