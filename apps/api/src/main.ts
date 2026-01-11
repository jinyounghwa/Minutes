import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import express from 'express';

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api');
  app.enableCors();

  app.use((req, res, next) => {
    logger.log(`${req.method} ${req.url}`);
    next();
  });

  const port = Number(process.env.PORT) || 4000;
  await app.init();

  server.listen(port, '0.0.0.0', () => {
    logger.log(`Application is running on: http://0.0.0.0:${port}/api`);
  });
}
bootstrap().catch((err) => {
  console.error('Error during bootstrap', err);
});
