import { randomUUID } from 'crypto';
import { Schema, model, Model } from 'mongoose';
import { User } from '../user';

interface MongoUser extends Omit<User, 'id'> {
  _id: string;
}

interface UserMethods {
  parse(): User;
}

type UserModel = Model<MongoUser, object, UserMethods>;

const schema = new Schema<MongoUser, UserModel, UserMethods>({
  _id: { type: String, required: true, default: randomUUID },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

schema.method('parse', function () {
  const { _id, name, age, email, password } = this.toObject() as MongoUser;

  const user = {
    id: String(_id),
    name,
    age,
    email,
    password,
  };

  return user;
});

export const $User = model<MongoUser, UserModel>('User', schema, 'user');
