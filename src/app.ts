// src/app.ts
import express from "express";
import dotenv from "dotenv";
import prisma from "./prismaClient";
import { PrismaUserRepository } from "./repositories/PrismaUserRepository";
import { UserService } from "./services/UserService";
import { UserController } from "./controllers/UserController";
import { userRouter } from "./routes/userRoutes";
import { errorHandler } from "./utils/errorHandler";

// Swagger
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

dotenv.config();

export async function createApp() {
  await prisma.$connect();

  const userRepo = new PrismaUserRepository();
  const userService = new UserService(userRepo);
  const userController = new UserController(userService);

  const app = express();
  app.use(express.json());

  // --- Swagger setup ---
  const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
      title: "User Service API",
      version: "1.0.0",
      description: "Документация API для сервиса работы с пользователями",
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 3000}` }],
  };
  const options = {
    swaggerDefinition,
    apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
  };
  const swaggerSpec = swaggerJSDoc(options);
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  // ---------------------

  app.use("/users", userRouter(userController));
  app.use(errorHandler);

  return app;
}
