import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async create(email: string, password: string, role: 'admin' | 'user' = 'user') {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      email,
      password: hashedPassword, //
      role,
    });
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    console.log('Fetched user:', user); // Add this
    return user;
  }

  async findAll() {
    return this.usersRepository.find();
  }
}
