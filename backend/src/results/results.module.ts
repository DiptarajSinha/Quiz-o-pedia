import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Result } from './results.entity';
import { ResultsController } from './results.controller';
import { ResultsService } from './results.service';
import { Quiz } from '../quiz/quiz.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Result, Quiz, User])],
  controllers: [ResultsController],
  providers: [ResultsService],
  exports: [ResultsService],
})
export class ResultsModule {}
