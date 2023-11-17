import { MongoUserRepository } from '@/repositories/mongo/mongo-user-repository';
import { RegisterUserService } from '../register-user-service';

export const makeRegisterUserService = () =>
  new RegisterUserService({
    userRepository: new MongoUserRepository(),
  });
