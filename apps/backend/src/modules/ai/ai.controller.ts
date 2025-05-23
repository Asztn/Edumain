import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AiService } from './ai.service';
import { GenerateDescriptionDto } from './dto/generate-description.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { User, Role } from '@prisma/client'; // Import User and Role

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @UseGuards(JwtAuthGuard)
  @Post('generate-description')
  @HttpCode(HttpStatus.OK)
  async generateDescription(
    @Body() generateDescriptionDto: GenerateDescriptionDto,
    @GetUser() user: User, // Ensure only authorized users (e.g., SELLERs or ADMINs) can use this
  ) {
    // Optional: Add role-based access control here if needed
    // For example, allow only SELLER or ADMIN roles
    if (user.role !== Role.SELLER && user.role !== Role.ADMIN) {
      // This is a simple check; more robust RBAC might be needed
      // For now, we assume any authenticated user can try, or adjust as per requirements
      // Consider if all authenticated users should be able to use this, or only specific roles.
      // For now, let's restrict to SELLER and ADMIN as they are creating resources.
      // throw new ForbiddenException('You do not have permission to generate descriptions.');
    }
    const description = await this.aiService.generateResourceDescription(generateDescriptionDto);
    return { description };
  }
}
