import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client'; // Assuming User entity from Prisma

export const GetUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as User; // User object is attached by JwtAuthGuard

    if (!user) {
      // This should ideally not happen if JwtAuthGuard is working correctly
      // and the route is protected.
      return null;
    }

    return data ? user[data] : user;
  },
);
