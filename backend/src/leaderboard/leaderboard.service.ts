import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Leaderboard } from './leaderboard.entity';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(Leaderboard)
    private leaderboardRepo: Repository<Leaderboard>,
  ) {}

  async getTopScores(quizId: string, limit = 10) {
    return this.leaderboardRepo.find({
      where: { quiz: { id: quizId } },
      relations: ['user'],
      order: { score: 'DESC', submittedAt: 'ASC' },
      take: limit,
    });
  }

  async recordScore(userId: string, quizId: string, score: number) {
    const existing = await this.leaderboardRepo.findOne({
      where: {
        user: { id: userId },
        quiz: { id: quizId },
      },
    });

    if (existing) return existing;

    const leaderboardEntry = this.leaderboardRepo.create({
      user: { id: userId },
      quiz: { id: quizId },
      score,
    });

    return this.leaderboardRepo.save(leaderboardEntry);
  }

  async getUserQuizHistory(userId: string) {
  return this.leaderboardRepo.find({
    where: { user: { id: userId } },
    relations: ['quiz'],
    order: { submittedAt: 'DESC' },
  });
}

}
