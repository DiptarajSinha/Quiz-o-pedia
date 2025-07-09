import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Leaderboard } from './leaderboard.entity';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardController } from './leaderboard.controller';
import { User } from '../users/user.entity';
import { Quiz } from '../quiz/quiz.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Leaderboard, User, Quiz])],
  providers: [LeaderboardService],
  controllers: [LeaderboardController],
  exports: [LeaderboardService],
})
export class LeaderboardModule {}
