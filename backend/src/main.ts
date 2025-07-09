import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Allow frontend to access backend (localhost:3001 → 3000)
  app.enableCors({
    origin: 'http://localhost:3001', // change for production
    credentials: true,
  });

  // ✅ Validate all incoming DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(3000);
}
bootstrap();
