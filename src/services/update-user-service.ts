import { User } from '@/models/user';
import { UserRepository } from '@/repositories/interfaces/user-repository';
import { EmailIsAlreadyInUseError } from './errors/email-is-already-in-use-error';
import { hash } from 'bcryptjs';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface UpdateUserServiceRepositories {
  userRepository: UserRepository;
}

interface UpdateUserServiceInput {
  id: string;
  name?: string;
  age?: number;
  email?: string;
  password?: string;
}

interface UpdateUserServiceOutput {
  user: User;
}

export class UpdateUserService {
  #userRepository: UserRepository;

  constructor({ userRepository }: UpdateUserServiceRepositories) {
    this.#userRepository = userRepository;
  }

  async #checkEmail(email: string) {
    const isEmailAlreadyInUse = await this.#userRepository.findByEmail(email);

    if (isEmailAlreadyInUse) {
      throw new EmailIsAlreadyInUseError();
    }

    return email;
  }

  async execute({
    id,
    name,
    age,
    email,
    password,
  }: UpdateUserServiceInput): Promise<UpdateUserServiceOutput> {
    const user = await this.#userRepository.findById(id);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    user.name = name ? name : user.name;
    user.age = age ? age : user.age;
    user.email = email ? await this.#checkEmail(email) : user.email;
    user.password = password ? await hash(password, 6) : user.password;

    await this.#userRepository.save(user);

    return {
      user,
    };
  }
}
