import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Quiz } from '../quiz/quiz.entity';

@Entity()
export class Result {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  score: number;
  
  @Column()
  totalQuestions: number;

  @CreateDateColumn()
  submittedAt: Date;

  @ManyToOne(() => User, (user) => user.results, { eager: false })
  user: User;

  @ManyToOne(() => Quiz, (quiz) => quiz.results, { eager: false })
  quiz: Quiz;
  
}
