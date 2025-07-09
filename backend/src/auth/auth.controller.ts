import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @Post('login')
async login(@Body() loginDto: LoginDto) {
  const user = await this.usersService.findByEmail(loginDto.email);
  console.log("Fetched user:", user);

  if (!user) {
    throw new UnauthorizedException('User not found');
  }

  console.log("Login password entered:", JSON.stringify(loginDto.password));
  console.log("Stored hash from DB:", user.password); 

  const isMatch = await bcrypt.compare(loginDto.password, user.password);
  console.log("Password match?", isMatch);

  if (!isMatch) {
    throw new UnauthorizedException('Invalid password');
  }

  return this.authService.login(user);
}


  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
}
