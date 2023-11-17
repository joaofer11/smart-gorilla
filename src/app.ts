import fastify from 'fastify';
import { userRoutes } from './controllers/user-routes';
import mongoose from 'mongoose';
import { env } from './env';

export const app = fastify();
app.register(userRoutes);

app.addHook('onReady', async () => {
  await mongoose.connect(env.DATABASE_URL, { dbName: 'smart_gorilla' });
  console.log('Connected to the database!');
});
