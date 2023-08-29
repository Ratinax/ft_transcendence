import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: `http://192.168.1.159:8080`,
    credentials: true,
  });
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true })); // max 50mb to receive form
  await app.listen(3000);
}
bootstrap();
