import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository';
import { it, expect, describe, beforeEach } from 'vitest';
import { UpdateUserService } from './update-user-service';
import { EmailIsAlreadyInUseError } from './errors/email-is-already-in-use-error';
import { compare } from 'bcryptjs';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

describe('Update User Service', () => {
  let userRepository: InMemoryUserRepository;
  let SUT: UpdateUserService;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    SUT = new UpdateUserService({
      userRepository,
    });
  });

  it('should not be able to update a user with a non-existing user id', async () => {
    await expect(() =>
      SUT.execute({
        id: 'NON_EXISTING_USER_ID',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to update a user with an email already in use', async () => {
    const EMAIL_ALREADY_IN_USE = 'johndoe@example.com';

    await userRepository.create({
      name: 'John Doe',
      age: 20,
      email: EMAIL_ALREADY_IN_USE,
      password: '123456',
    });

    const myUser = await userRepository.create({
      name: 'John Doe',
      age: 20,
      email: 'me.johndoe@example.com',
      password: '123456',
    });

    await expect(() =>
      SUT.execute({ id: myUser.id, email: EMAIL_ALREADY_IN_USE })
    ).rejects.toBeInstanceOf(EmailIsAlreadyInUseError);
  });

  it('should be able to encrypt (hash) user password upon update', async () => {
    const myUser = await userRepository.create({
      name: 'John Doe',
      age: 20,
      email: 'me.johndoe@example.com',
      password: 'OLD_PASSWORD',
    });

    const NEW_PASSWORD = '123456';

    const { user } = await SUT.execute({
      id: myUser.id,
      password: NEW_PASSWORD,
    });

    const hasPasswordBeenCorrectlyHashed = await compare(
      NEW_PASSWORD,
      user.password
    );

    expect(hasPasswordBeenCorrectlyHashed).toBe(true);
  });

  it('should be able to update a user', async () => {
    const myUser = await userRepository.create({
      name: 'John Doe',
      age: 20,
      email: 'me.johndoe@example.com',
      password: '123456',
    });

    const { user } = await SUT.execute({
      id: myUser.id,
      name: 'Jane Doe',
      age: 27,
      email: 'janedoe@example.com',
      password: '123',
    });

    expect(user).toEqual(
      expect.objectContaining({
        id: myUser.id,
        name: 'Jane Doe',
        age: 27,
        email: 'janedoe@example.com',
        password: expect.any(String),
      })
    );
  });
});
