import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class SignInDTO {
  @ApiProperty()
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}

export class RefreshTokenDTO {
  @ApiProperty()
  @IsNotEmpty()
  refreshToken: string;
}

export class LogOutDTO {
  @ApiProperty()
  @IsNotEmpty()
  userName: string;
}
