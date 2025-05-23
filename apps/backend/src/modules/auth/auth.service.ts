import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../users/users.service'; // Will be created later
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { User, Role } from '@prisma/client';
import { JwtPayload } from './strategies/jwt.strategy';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<{ accessToken: string }> {
    const { name, email, password, role } = registerUserDto;

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.usersService.create({
        name,
        email,
        password: hashedPassword,
        role: role || Role.BUYER,
      });

      const payload: JwtPayload = { sub: user.id, email: user.email };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    } catch (error) {
      // Handle potential Prisma errors, e.g., unique constraint violation if not caught by findByEmail
      if (error.code === 'P2002') { // Prisma unique constraint violation
        throw new ConflictException('Email already registered');
      }
      throw new InternalServerErrorException('Could not register user');
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    const { email, password } = loginUserDto;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async validateUser(payload: JwtPayload): Promise<User | null> {
    // This method is used by JwtStrategy after token validation
    // to fetch the user from the database.
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      // This case should ideally not happen if the token was valid
      // and the sub (user ID) in the token corresponds to an existing user.
      // However, it's a good practice to handle it.
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  // Helper to generate token (can be used by other services if needed)
  generateJwtToken(user: User): string {
    const payload: JwtPayload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }
}
