import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  // No explicit enableShutdownHooks needed here as NestJS handles it
  // when the PrismaClient is part of a module that's correctly
  // registered with the application.
  // See: https://docs.nestjs.com/recipes/prisma#issues-with-enableshutdownhooks
}
