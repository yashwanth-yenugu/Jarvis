import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SkipAuth } from './auth.decorator';
import { AuthService } from './auth.service';
import { LogOutDTO, RefreshTokenDTO, SignInDTO } from './dto/signIn';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @SkipAuth()
  @Post('sign-up')
  signUp(@Body() signInDto: SignInDTO) {
    return this.authService.signUp(signInDto.userName, signInDto.password);
  }

  @SkipAuth()
  @Post('login')
  signIn(@Body() signInDto: SignInDTO) {
    return this.authService.signIn(signInDto.userName, signInDto.password);
  }

  @SkipAuth()
  @Post('refresh')
  refreshToken(@Body() body: RefreshTokenDTO) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @SkipAuth()
  @Post('logout')
  logout(@Body() body: LogOutDTO) {
    return this.authService.logout(body.userName);
  }
}
