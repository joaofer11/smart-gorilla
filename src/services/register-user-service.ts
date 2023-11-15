import { User } from '@/models/user';
import { UserRepository } from '@/repositories/interfaces/user-repository';
import { EmailIsAlreadyInUseError } from './errors/email-is-already-in-use-error';
import { hash } from 'bcryptjs';

interface RegisterUserServiceRepositories {
  userRepository: UserRepository;
}

interface RegisterUserServiceInput {
  name: string;
  age: number;
  email: string;
  password: string;
}

interface RegisterUserServiceOutput {
  user: User;
}

export class RegisterUserService {
  #userRepository: UserRepository;

  constructor({ userRepository }: RegisterUserServiceRepositories) {
    this.#userRepository = userRepository;
  }

  async execute({
    name,
    age,
    email,
    password,
  }: RegisterUserServiceInput): Promise<RegisterUserServiceOutput> {
    const isEmailAlreadyInUse = await this.#userRepository.findByEmail(email);

    if (isEmailAlreadyInUse) {
      throw new EmailIsAlreadyInUseError();
    }

    const user = await this.#userRepository.create({
      name,
      age,
      email,
      password: await hash(password, 6),
    });

    return {
      user,
    };
  }
}
