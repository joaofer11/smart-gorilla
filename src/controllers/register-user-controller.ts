import { z } from 'zod';
import { RegisterUserService } from '@/services/register-user-service';
import { EmailIsAlreadyInUseError } from '@/services/errors/email-is-already-in-use-error';

type MakeRegisterUserService = () => RegisterUserService;

export class RegisterUserController {
  #makeRegisterUserService: MakeRegisterUserService;

  constructor(makeRegisterUserService: MakeRegisterUserService) {
    this.#makeRegisterUserService = makeRegisterUserService;
  }

  async execute(data: unknown) {
    const dataSchema = z.object({
      name: z.string().min(1),
      age: z.number().min(1),
      email: z.string().min(1),
      password: z.string().min(6),
    });

    const { name, age, email, password } = dataSchema.parse(data);

    try {
      const registerUserService = this.#makeRegisterUserService();

      const { user } = await registerUserService.execute({
        name,
        age,
        email,
        password,
      });

      const toClientUser = {
        ...user,
        password: undefined,
      };

      return {
        user: toClientUser,
      };
    } catch (error) {
      if (error instanceof EmailIsAlreadyInUseError) {
        return {
          error: {
            message: error.message,
            statusCode: 409,
          },
        };
      }
    }
  }
}
