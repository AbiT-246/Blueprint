import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

const DEFAULT_PORT = 3001;
const DEFAULT_CORS_ORIGIN = 'http://localhost:3000';
// Base64 inflates payloads by ~33%, so this fits a 10 MB image upload.
const JSON_BODY_LIMIT = '15mb';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? DEFAULT_CORS_ORIGIN,
    credentials: true,
  });
  app.useBodyParser('json', { limit: JSON_BODY_LIMIT });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const port = Number(process.env.PORT) || DEFAULT_PORT;
  await app.listen(port, '0.0.0.0');
}

void bootstrap();
