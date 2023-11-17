import { app } from './app';
import { env } from './env';

app.listen(
  {
    host: '127.0.0.1',
    port: env.PORT,
  },
  () => console.log(`Server running on localhost:${env.PORT}`)
);
