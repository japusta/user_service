// src/routes/userRoutes.ts
import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { validateDto } from "../middlewares/validate";
import { RegisterDto } from "../dto/RegisterDto";
import { LoginDto } from "../dto/LoginDto";

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterDto:
 *       type: object
 *       required:
 *         - fullName
 *         - birthDate
 *         - email
 *         - password
 *       properties:
 *         fullName:
 *           type: string
 *           example: Ivan Petrov
 *         birthDate:
 *           type: string
 *           format: date
 *           example: 1990-01-01
 *         email:
 *           type: string
 *           format: email
 *           example: ivan@example.com
 *         password:
 *           type: string
 *           example: secret123
 *         role:
 *           type: string
 *           enum: [USER, ADMIN]
 *           example: USER
 *     LoginDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: ivan@example.com
 *         password:
 *           type: string
 *           example: secret123
 */
export function userRouter(controller: UserController) {
  const router = Router();

  /**
   * @swagger
   * /users/register:
   *   post:
   *     summary: Регистрация нового пользователя
   *     tags:
   *       - Users
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RegisterDto'
   *     responses:
   *       201:
   *         description: Пользователь успешно создан
   *       400:
   *         description: Ошибка валидации
   */
  router.post("/register", validateDto(RegisterDto), controller.register);

  /**
   * @swagger
   * /users/login:
   *   post:
   *     summary: Аутентификация пользователя (получить JWT)
   *     tags:
   *       - Users
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginDto'
   *     responses:
   *       200:
   *         description: Успешная аутентификация
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *                   example: eyJh...
   *       400:
   *         description: Некорректные данные запроса
   *       401:
   *         description: Неверные учётные данные
   */
  router.post("/login", validateDto(LoginDto), controller.login);

  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     summary: Получить пользователя по ID
   *     tags:
   *       - Users
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Уникальный идентификатор пользователя
   *     responses:
   *       200:
   *         description: Информация о пользователе
   *       401:
   *         description: Отсутствует или неверен токен
   *       403:
   *         description: Доступ запрещён
   *       404:
   *         description: Пользователь не найден
   */
  router.get("/:id", authMiddleware, controller.getById);

  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Получить список всех пользователей
   *     tags:
   *       - Users
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Массив объектов пользователей
   *       401:
   *         description: Отсутствует или неверен токен
   *       403:
   *         description: Доступ запрещён (admin only)
   */
  router.get("/", authMiddleware, adminMiddleware, controller.listAll);

  /**
   * @swagger
   * /users/{id}/block:
   *   patch:
   *     summary: Блокировка пользователя
   *     tags:
   *       - Users
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: UID пользователя для блокировки
   *     responses:
   *       204:
   *         description: Пользователь заблокирован
   *       401:
   *         description: Токен не предоставлен или неверен
   *       403:
   *         description: Доступ запрещён
   */
  router.patch("/:id/block", authMiddleware, controller.block);

  return router;
}

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
