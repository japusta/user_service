import request from 'supertest';
import { createApp } from '../src/app';
import prisma from '../src/prismaClient';

describe('Users E2E', () => {
  //let app: Express.Application;
  let app: any;
  let userId: string;
  let token: string;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    app = await createApp();
    // чистим тестовую базу
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/users/register')
      .send({
        fullName: 'Test User',
        birthDate: '2000-01-01',
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    userId = res.body.id;
  });

  it('should login and return a token', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('should get own profile', async () => {
    const res = await request(app)
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('email', 'test@example.com');
  });

  it('should block self', async () => {
    const res = await request(app)
      .patch(`/users/${userId}/block`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(204);
  });

  it('should not login blocked user', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(res.status).toBe(401);
  });
});