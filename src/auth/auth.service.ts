import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private async generateTokens(id: number, userName: string) {
    return {
      access_token: await this.jwtService.signAsync({ sub: id, userName }),
      refresh_token: await this.jwtService.signAsync(
        { sub: id, typ: 'Refresh', userName },
        { expiresIn: '7d' },
      ),
    };
  }

  async signIn(userName: string, password: string) {
    const user = await this.usersService.findOne(userName);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new UnauthorizedException();
    }
    const tokens = await this.generateTokens(user.id, user.userName);
    await this.usersService.saveRefreshToken(tokens.refresh_token, userName);
    return tokens;
  }

  async signUp(username: string, password: string) {
    const passwordHash = await bcrypt.hash(
      password,
      +this.configService.get<number>('B_CRYPT_SALT'),
    );
    return this.usersService.create(username, passwordHash);
  }

  async logout(username: string) {
    return this.usersService.deleteRefreshToken(username);
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken);
      const userData = await this.usersService.findOne(decoded.userName);

      if (userData.refreshTokens === refreshToken) {
        const tokens = await this.generateTokens(decoded.sub, decoded.userName);

        this.usersService.saveRefreshToken(
          tokens.refresh_token,
          decoded.userName,
        );

        return tokens;
      } else {
        return new BadRequestException('Token not available in DB');
      }
    } catch (error) {
      return new BadRequestException('Invalid refresh token', error);
    }
  }
}
