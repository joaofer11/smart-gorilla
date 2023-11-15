import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository';
import { it, expect, describe, beforeEach } from 'vitest';
import { RegisterUserService } from './register-user-service';
import { EmailIsAlreadyInUseError } from './errors/email-is-already-in-use-error';
import { compare } from 'bcryptjs';

describe('Register User Service', () => {
  let userRepository: InMemoryUserRepository;
  let SUT: RegisterUserService;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    SUT = new RegisterUserService({
      userRepository,
    });
  });

  it('should not be able to register a user with an email already in use', async () => {
    const EMAIL = 'johndoe@example.com';

    userRepository.create({
      name: 'John Doe',
      age: 20,
      email: EMAIL,
      password: '123456',
    });

    await expect(() =>
      SUT.execute({
        name: 'John Doe',
        age: 20,
        email: EMAIL,
        password: '123456',
      })
    ).rejects.toBeInstanceOf(EmailIsAlreadyInUseError);
  });

  it('should be able to encrypt (hash) user password', async () => {
    const PASSWORD = '123456';

    const { user } = await SUT.execute({
      name: 'John Doe',
      age: 20,
      email: 'johndoe@example.com',
      password: PASSWORD,
    });

    const hasPasswordBeenCorrectlyHashed = await compare(
      PASSWORD,
      user.password
    );

    expect(hasPasswordBeenCorrectlyHashed).toBe(true);
  });

  it('should be able to register a user', async () => {
    const { user } = await SUT.execute({
      name: 'John Doe',
      age: 20,
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'John Doe',
        age: 20,
        email: 'johndoe@example.com',
        password: expect.any(String),
      })
    );
  });
});
