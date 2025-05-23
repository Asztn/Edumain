import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module'; // For JwtAuthGuard
import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule, // Importing AuthModule makes JwtAuthGuard and related components available
  ],
  controllers: [ResourcesController],
  providers: [ResourcesService],
  exports: [ResourcesService], // Export if other modules need ResourcesService
})
export class ResourcesModule {}
