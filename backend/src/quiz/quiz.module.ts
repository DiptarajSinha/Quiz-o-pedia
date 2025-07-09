import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './quiz.entity';
import { Question } from './question.entity';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { HttpModule } from '@nestjs/axios';
import { LeaderboardModule } from '../leaderboard/leaderboard.module';
import { Result } from '../results/results.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz, Question,Result, User]),
    HttpModule,
    LeaderboardModule,
    ],
  providers: [QuizService],
  controllers: [QuizController],
})
export class QuizModule {}
