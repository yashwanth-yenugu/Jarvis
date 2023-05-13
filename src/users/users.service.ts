import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(userName: string): Promise<User | undefined> {
    return await this.usersRepository.findOneBy({ userName });
  }

  async saveRefreshToken(token: string, userName: string) {
    this.usersRepository.update({ userName }, { refreshTokens: token });
  }

  async deleteRefreshToken(userName: string) {
    this.usersRepository.update({ userName }, { refreshTokens: null });
  }

  async create(userName: string, password: string) {
    try {
      const userEntity = this.usersRepository.create({ userName, password });
      const res = await this.usersRepository.save(userEntity);
      return { userName: res.userName, createdAt: res.createdAt };
    } catch (error) {
      if (error.errno === 1062) {
        return new BadRequestException('Username not available');
      }
      return new BadRequestException(error.code);
    }
  }
}
