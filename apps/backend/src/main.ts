import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { PrismaService } from './prisma/prisma.service'; // Not directly used in main.ts usually for enableShutdownHooks

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Global Prefix
  app.setGlobalPrefix('api');

  // CORS
  app.enableCors({
    origin: '*', // Replace with your frontend URL in production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  logger.log(`CORS enabled`);

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips away properties that do not have any decorators
      forbidNonWhitelisted: true, // Throws an error if non-whitelisted values are provided
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Convert query/path params to primitive types based on TS type
      },
    }),
  );
  logger.log(`GlobalPipes set with ValidationPipe`);

  // Prisma Shutdown Hooks
  // const prismaService = app.get(PrismaService);
  // await prismaService.enableShutdownHooks(app); // This is now handled by NestJS itself if PrismaClient is part of a module.
  // See: https://docs.nestjs.com/recipes/prisma#issues-with-enableshutdownhooks

  const port = configService.get<number>('PORT', 3001); // Default to 3001 if not set in .env
  await app.listen(port);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
