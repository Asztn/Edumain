import { Controller, Post, Get, Body, Param, UseGuards, NotFoundException, Query, Patch, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { User, Role } from '@prisma/client'; // Import User and Role
import { Prisma } from '@prisma/client'; // Import Prisma for UpdateResourceDto

// It's good practice to define an UpdateResourceDto if you have specific updatable fields
// For now, we can use Prisma.ResourceUpdateInput, but a DTO is better for validation.
// import { UpdateResourceDto } from './dto/update-resource.dto';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createResourceDto: CreateResourceDto,
    @GetUser() user: User, // Get the whole user object
  ) {
    // Ensure the user is a SELLER or ADMIN before creating
    if (user.role !== Role.SELLER && user.role !== Role.ADMIN) {
        // This check is also in service, but good for early exit
        throw new NotFoundException('User must be a SELLER or ADMIN to create resources.');
    }
    return this.resourcesService.create(createResourceDto, user.id);
  }

  @Get()
  async findAll() {
    // Add query parameters for filtering, pagination, sorting later
    return this.resourcesService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const resource = await this.resourcesService.findById(id);
    if (!resource) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }
    return resource;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateResourceDto: Prisma.ResourceUpdateInput, // Or UpdateResourceDto
    @GetUser('id') userId: string,
  ) {
    // The service will handle ownership/permission checks
    return this.resourcesService.update(id, updateResourceDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Or HttpStatus.OK if you return the deleted object
  async remove(
    @Param('id') id: string,
    @GetUser('id') userId: string,
  ) {
    // The service will handle ownership/permission checks
    await this.resourcesService.remove(id, userId);
    // No content to return, or return the deleted resource if preferred
  }
}
