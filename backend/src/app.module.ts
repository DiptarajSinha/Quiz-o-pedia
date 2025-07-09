import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { QuizModule } from './quiz/quiz.module';
import { Quiz } from './quiz/quiz.entity';
import { Question } from './quiz/question.entity';
import { HttpModule } from '@nestjs/axios';
import { ChatbotModule } from './chatbot/chatbot.module';
import { Leaderboard } from './leaderboard/leaderboard.entity';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { PdfModule } from './pdf/pdf.module';
import { ResultsModule } from './results/results.module';
import { Result } from './results/results.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    HttpModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: true,
      entities: [User, Quiz, Question, Leaderboard, Result],
    }),
    UsersModule,
    AuthModule,
    QuizModule,
    ChatbotModule,
    LeaderboardModule,
    PdfModule,
    ResultsModule,
  ],
})
export class AppModule {}
