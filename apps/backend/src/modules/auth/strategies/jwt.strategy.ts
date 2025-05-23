import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service'; // Adjusted path
import { User } from '@prisma/client';

export interface JwtPayload {
  sub: string; // Standard JWT subject field, typically user ID
  email: string;
  // Add any other fields you include in your JWT payload
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<User | null> {
    // The payload is the decoded JWT.
    // We use the 'sub' field (user ID) to find the user.
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    // If user is found, it will be attached to the request object (e.g., req.user)
    // If not found, or for any other validation failure, Passport will throw a 401 Unauthorized error.
    return user; // Or handle not found user explicitly if needed
  }
}
