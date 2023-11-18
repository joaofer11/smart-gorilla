import { FastifyInstance } from 'fastify';
import { RegisterUserController } from './register-user-controller';
import { makeRegisterUserService } from '@/services/factories/make-register-user-service';

export const userRoutes = async (app: FastifyInstance) => {
  app.post('/users', async (request, response) => {
    const registerUserController = new RegisterUserController(
      makeRegisterUserService
    );

    const data = await registerUserController.execute(request.body);

    if (data?.error) {
      const { statusCode, message } = data.error;

      return response.status(statusCode).send({ message });
    }

    return response.status(201).send(data);
  });
};
