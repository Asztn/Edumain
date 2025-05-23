import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // ConfigModule is needed for AiService
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AuthModule } from '../auth/auth.module'; // For JwtAuthGuard

@Module({
  imports: [
    ConfigModule, // Make sure ConfigService is available
    AuthModule,   // To protect the AI controller routes
  ],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService], // Export if other modules need AiService
})
export class AiModule {}
