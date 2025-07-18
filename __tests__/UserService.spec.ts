import { UserService } from '../src/services/UserService';
import { IUserRepository } from '../src/repositories/IUserRepository';
import { UserRole, UserStatus } from '../src/entities/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('UserService (unit)', () => {
  let service: UserService;
  let repo: jest.Mocked<IUserRepository>;
  const fakeUser = {
    id: '123',
    fullName: 'Test User',
    birthDate: new Date('2000-01-01'),
    email: 'test@example.com',
    passwordHash: 'hashed',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
  } as any;

beforeEach(() => {
  // 1) Репозиторий можно оставить как any
  repo = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    updateStatus: jest.fn(),
  };
  service = new UserService(repo as IUserRepository);

  // 2) Перекроем методы bcrypt и jwt напрямую
  bcrypt.hash = jest.fn().mockResolvedValue('hashed');
  bcrypt.compare = jest.fn().mockResolvedValue(true);
  jwt.sign = jest.fn().mockReturnValue('token');
});


  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('register', () => {
    it('throws if email exists', async () => {
      repo.findByEmail.mockResolvedValue(fakeUser);
      await expect(
        service.register({
          fullName: 'A', birthDate: '2000-01-01', email: 'test@example.com', password: 'pass',
        })
      ).rejects.toThrow('Email already in use');
    });

    it('creates user if email is free', async () => {
      repo.findByEmail.mockResolvedValue(null);
      repo.create.mockResolvedValue(fakeUser);
      const user = await service.register({
        fullName: 'A', birthDate: '2000-01-01', email: 'test@example.com', password: 'pass',
      });
      expect(bcrypt.hash).toHaveBeenCalledWith('pass', 10);
      expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({
        fullName: 'A', email: 'test@example.com', passwordHash: 'hashed', role: UserRole.USER, status: UserStatus.ACTIVE
      }));
      expect(user).toEqual(fakeUser);
    });

    it('throws on invalid date', async () => {
      repo.findByEmail.mockResolvedValue(null);
      await expect(
        service.register({ fullName: 'A', birthDate: 'invalid', email: 'b@b.com', password: 'pass' })
      ).rejects.toThrow('Invalid birthDate format');
    });
  });

  describe('authenticate', () => {
    it('throws if no user', async () => {
      repo.findByEmail.mockResolvedValue(null);
      await expect(service.authenticate('a@a.com', 'pass')).rejects.toThrow('Invalid credentials');
    });
    it('throws if password mismatch', async () => {
      repo.findByEmail.mockResolvedValue(fakeUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.authenticate('a@a.com', 'pass')).rejects.toThrow('Invalid credentials');
    });
    it('returns token on success', async () => {
      repo.findByEmail.mockResolvedValue(fakeUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      const t = await service.authenticate('a@a.com', 'pass');
      expect(jwt.sign).toHaveBeenCalledWith({ sub: fakeUser.id, role: fakeUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      expect(t).toBe('token');
    });
  });

  describe('getById', () => {
    it('throws Unauthorized if requester not found', async () => {
      repo.findById.mockResolvedValue(null);
      await expect(service.getById('r', 't')).rejects.toThrow('Unauthorized');
    });
    it('throws Forbidden if not admin and not self', async () => {
      repo.findById.mockResolvedValue({ ...fakeUser, role: UserRole.USER });
      await expect(service.getById('r', 't')).rejects.toThrow('Forbidden');
    });
    // it('returns user on admin request', async () => {
    //   repo.findById.mockResolvedValue({ ...fakeUser, role: UserRole.ADMIN });
    //   repo.findById.mockResolvedValueOnce(fakeUser).mockResolvedValueOnce({ ...fakeUser, role: UserRole.ADMIN });
    //   // first call is requestor, second is target
    //   const u = await service.getById('a', 'b');
    //   expect(u).toEqual(fakeUser);
    // });

     it('returns user on admin request', async () => {
   // 1s call => requestor, мы хотим ADMIN
   repo.findById.mockResolvedValueOnce({ ...fakeUser, role: UserRole.ADMIN });
   // 2 call => target, возвращаем обычного fakeUser
   repo.findById.mockResolvedValueOnce(fakeUser);

   const u = await service.getById('admin-id', 'target-id');
   expect(u).toEqual(fakeUser);
 });
  });

  describe('listAll', () => {
    it('throws if not admin', async () => {
      repo.findById.mockResolvedValue({ ...fakeUser, role: UserRole.USER });
      await expect(service.listAll('u')).rejects.toThrow('Forbidden');
    });
    it('returns array if admin', async () => {
      repo.findById.mockResolvedValue({ ...fakeUser, role: UserRole.ADMIN });
      repo.findAll.mockResolvedValue([fakeUser]);
      const arr = await service.listAll('a');
      expect(arr).toEqual([fakeUser]);
    });
  });

  describe('block', () => {
    it('throws Unauthorized if requester not found', async () => {
      repo.findById.mockResolvedValue(null);
      await expect(service.block('r', 't')).rejects.toThrow('Unauthorized');
    });
    it('throws Forbidden if not admin and not self', async () => {
      repo.findById.mockResolvedValue({ ...fakeUser, role: UserRole.USER });
      await expect(service.block('r', 't')).rejects.toThrow('Forbidden');
    });
    it('blocks if allowed', async () => {
  repo.findById.mockResolvedValue(fakeUser);
  // self-block: requestorId === targetId
  await service.block(fakeUser.id, fakeUser.id);
  expect(repo.updateStatus).toHaveBeenCalledWith(
    fakeUser.id,
    UserStatus.BLOCKED
  );
    });
  });
});