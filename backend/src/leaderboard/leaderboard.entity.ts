import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Quiz } from '../quiz/quiz.entity';
import { User } from '../users/user.entity';

@Entity()
export class Leaderboard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Quiz)
  quiz: Quiz;

  @Column()
  score: number;

  @CreateDateColumn()
  submittedAt: Date;
}
