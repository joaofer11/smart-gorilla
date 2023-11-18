import { randomUUID } from 'node:crypto';
import { User } from '@/models/user';
import { CreateUserDTO, UserRepository } from '../interfaces/user-repository';

export class InMemoryUserRepository implements UserRepository {
  items: User[] = [];

  async findById(id: string) {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async findByEmail(email: string) {
    return this.items.find((item) => item.email === email) ?? null;
  }

  async create(data: CreateUserDTO) {
    const user = {
      id: data.id ?? randomUUID(),
      name: data.name,
      age: data.age,
      email: data.email,
      password: data.password,
    };

    this.items.push(user);

    return user;
  }

  async save(data: User) {
    const userIndex = this.items.findIndex((item) => item.id === data.id);

    this.items[userIndex] = data;

    return this.items[userIndex];
  }
}
