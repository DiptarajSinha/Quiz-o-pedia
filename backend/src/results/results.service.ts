import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from './results.entity';
import { Quiz } from '../quiz/quiz.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ResultsService {
  constructor(
    @InjectRepository(Result)
    private resultRepo: Repository<Result>,
    @InjectRepository(Quiz)
    private quizRepo: Repository<Quiz>,
    @InjectRepository(User)
    private userRepo: Repository<User>
  ) {}

  async getResultsForUser(userId: string) {
    return this.resultRepo.find({
      where: { user: { id: userId } },
      relations: ['quiz'],
      order: { submittedAt: 'DESC' },
    });
  }
}
