import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'Yash',
      password: 'Yenugu@123',
    },
    {
      userId: 2,
      username: 'Yash2',
      password: 'Yenugu@123',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async create(username: string, password: string) {
    this.users.push({ username, password, userId: this.users.length + 1 });
  }
}
