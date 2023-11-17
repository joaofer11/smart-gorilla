import { $User } from '@/models/mongo/mongo-user';
import { CreateUserDTO, UserRepository } from '../interfaces/user-repository';

export class MongoUserRepository implements UserRepository {
  async findById(id: string) {
    const user = await $User.findById(id).exec();

    if (!user) return null;

    return user.parse();
  }

  async findByEmail(email: string) {
    const user = await $User.findOne({ email }).exec();

    if (!user) return null;

    return user.parse();
  }

  async create(data: CreateUserDTO) {
    const user = new $User({
      name: data.name,
      age: data.age,
      email: data.email,
      password: data.password,
    });

    await user.save();

    return user.parse();
  }
}
