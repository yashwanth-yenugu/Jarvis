import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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

  async signIn(userName: string, pass: string) {
    const user = await this.usersService.findOne(userName);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const tokens = await this.generateTokens(user.id, user.userName);
    await this.usersService.saveRefreshToken(tokens.refresh_token, userName);
    return tokens;
  }

  async signUp(username: string, pass: string) {
    return this.usersService.create(username, pass);
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
        throw new UnauthorizedException('Token not available in DB');
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
