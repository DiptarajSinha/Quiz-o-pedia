import { Controller, Get, Param } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get(':quizId')
  async getTopScores(@Param('quizId') quizId: string) {
    return this.leaderboardService.getTopScores(quizId);
  }

  @Get('user/:userId')
  async getUserHistory(@Param('userId') userId: string) {
    return this.leaderboardService.getUserQuizHistory(userId);
  }
}
