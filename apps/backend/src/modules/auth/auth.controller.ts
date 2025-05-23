import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
// import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'; // To be created
// import { GetUser } from '../../common/decorators/get-user.decorator'; // To be created
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<{ accessToken: string }> {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    return this.authService.login(loginUserDto);
  }

  // Example of a protected route, assuming JwtAuthGuard and GetUser are created
  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(@GetUser() user: User) {
  //   // user will contain the authenticated user object without the password
  //   // You might want to fetch the full user profile from UsersService here if needed
  //   // For now, just return the user object obtained from the token
  //   const { password, ...result } = user; // Exclude password
  //   return result;
  // }
}
