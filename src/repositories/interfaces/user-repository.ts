import { User } from '@/models/user';

export interface CreateUserDTO {
  id?: string | null;
  name: string;
  age: number;
  email: string;
  password: string;
}

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserDTO): Promise<User>;
  save(data: User): Promise<User>;
}
