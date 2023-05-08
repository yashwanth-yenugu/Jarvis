import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SkipAuth } from './auth.decorator';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto/signIn';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @SkipAuth()
  @Post('sign-up')
  signUp(@Body() signInDto: SignInDTO) {
    return this.authService.signUp(signInDto.username, signInDto.password);
  }

  @SkipAuth()
  @Post('login')
  signIn(@Body() signInDto: SignInDTO) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
