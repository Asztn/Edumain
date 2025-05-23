import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    // Password should already be hashed before calling this service
    return this.prisma.user.create({
      data,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      // It's often better to let the calling service decide how to handle not found users,
      // but for critical lookups (like validating a JWT), throwing an error might be appropriate.
      // For now, let's keep it simple and return null or throw if contextually critical.
      // In AuthService.validateUser, we expect a user or throw.
    }
    return user;
  }
}
