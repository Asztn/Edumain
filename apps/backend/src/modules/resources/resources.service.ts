import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { Prisma, Resource, User } from '@prisma/client';

@Injectable()
export class ResourcesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createResourceDto: CreateResourceDto, sellerId: string): Promise<Resource> {
    // Ensure the user creating the resource is a SELLER or ADMIN
    const seller = await this.prisma.user.findUnique({ where: { id: sellerId } });
    if (!seller || (seller.role !== 'SELLER' && seller.role !== 'ADMIN')) {
      throw new ForbiddenException('Only sellers or admins can create resources.');
    }

    const { title, description, price, category, subject, gradeLevel, coverImageUrl, previewImageUrls, fileUrl } = createResourceDto;

    return this.prisma.resource.create({
      data: {
        title,
        description,
        price,
        category,
        subject,
        gradeLevel,
        coverImageUrl,
        previewImageUrls: previewImageUrls || [],
        fileUrl,
        seller: {
          connect: { id: sellerId },
        },
      },
    });
  }

  async findAll(): Promise<Resource[]> {
    return this.prisma.resource.findMany({
      // Add include for seller info if needed on listing
      // include: { seller: { select: { id: true, name: true, email: true } } }
    });
  }

  async findById(id: string): Promise<Resource | null> {
    const resource = await this.prisma.resource.findUnique({
      where: { id },
      // include: { seller: { select: { id: true, name: true, email: true } } } // Include seller details
    });
    if (!resource) {
      // Let the controller handle the NotFoundException for a cleaner API response
    }
    return resource;
  }

  async update(id: string, data: Prisma.ResourceUpdateInput, userId: string): Promise<Resource> {
    const resource = await this.findById(id);
    if (!resource) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }
    if (resource.sellerId !== userId) {
      // Or check if user is ADMIN
      const user = await this.prisma.user.findUnique({ where: { id: userId }});
      if (user?.role !== 'ADMIN') {
         throw new ForbiddenException('You do not have permission to update this resource.');
      }
    }
    return this.prisma.resource.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, userId: string): Promise<Resource> {
    const resource = await this.findById(id);
    if (!resource) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }
     if (resource.sellerId !== userId) {
      // Or check if user is ADMIN
      const user = await this.prisma.user.findUnique({ where: { id: userId }});
      if (user?.role !== 'ADMIN') {
        throw new ForbiddenException('You do not have permission to delete this resource.');
      }
    }
    return this.prisma.resource.delete({
      where: { id },
    });
  }
}
