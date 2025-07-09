import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from './quiz.entity';
import { Question } from './question.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { AiQuizDto } from './dto/ai-quiz.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { LeaderboardService } from '../leaderboard/leaderboard.service';
import { Result } from '../results/results.entity';
import { User } from '../users/user.entity';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Result)
    private resultRepository: Repository<Result>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly httpService: HttpService,
    private readonly leaderboardService: LeaderboardService
  ) {}

  async create(createQuizDto: CreateQuizDto): Promise<Quiz> {
    const quiz = this.quizRepository.create(createQuizDto);
    return this.quizRepository.save(quiz);
  }

  async findAll(): Promise<Quiz[]> {
    return this.quizRepository.find({ relations: ['questions'] });
  }

  async findAllWithUserStatus(userId: string): Promise<any[]> {
    const quizzes = await this.quizRepository.find({ relations: ['questions'] });

    const userResults = await this.resultRepository.find({
      where: { user: { id: userId } },
      relations: ['quiz'],
    });

    const attemptedQuizMap = new Map(
      userResults.map((result) => [result.quiz.id, result])
    );

    return quizzes.map((quiz) => {
      const attempt = attemptedQuizMap.get(quiz.id);
      return {
        ...quiz,
        attempted: !!attempt,
        userScore: attempt?.score || null,
      };
    });
  }

  async findOne(id: string): Promise<Quiz | null> {
    return this.quizRepository.findOne({
      where: { id },
      relations: ['questions'],
    });
  }

  async evaluateQuiz(
  quizId: string,
  answers: { questionId: string; selectedOption: string }[],
  userId?: string
) {
  const quiz = await this.quizRepository.findOne({
    where: { id: quizId },
    relations: ['questions'],
  });

  if (!quiz) {
    throw new NotFoundException('Quiz not found');
  }

  if (userId) {
    const alreadyAttempted = await this.resultRepository.findOne({
      where: {
        user: { id: userId },
        quiz: { id: quizId },
      },
    });

    if (alreadyAttempted) {
      throw new Error('You have already attempted this quiz');
    }
  }

  let score = 0;
  const feedback = quiz.questions.map((question) => {
    const userAnswer = answers.find((a) => a.questionId === question.id);
    const isCorrect = userAnswer?.selectedOption === question.correctAnswer;
    if (isCorrect) score++;

    return {
      question: question.text,
      selected: userAnswer?.selectedOption,
      correct: question.correctAnswer,
      isCorrect,
    };
  });

  const totalQuestions = quiz.questions.length;

  if (userId) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (user) {
      const result = this.resultRepository.create({
        user,
        quiz,
        score,
        totalQuestions,
      });

      await this.resultRepository.save(result);
      await this.leaderboardService.recordScore(userId, quizId, score);
    }
  }

  return {
    quizId,
    totalQuestions,
    score,
    feedback,
  };
}

  async generateQuizUsingGemini(aiQuizDto: AiQuizDto) {
    const { topic, numQuestions } = aiQuizDto;

    const prompt = `
Generate ${numQuestions} multiple choice questions on "${topic}". 
Each question should include:
- "text": the question
- "options": array of 3 choices
- "correctAnswer": one correct answer from the options

Respond ONLY in JSON array format:
[
  {
    "text": "...",
    "options": ["A", "B", "C"],
    "correctAnswer": "A"
  }
]
`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await lastValueFrom(
      this.httpService.post(
        url,
        {
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );

    const rawText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error('Gemini response missing or invalid');

    const cleaned = rawText.replace(/```json|```/g, '').trim();

    let questions;
    try {
      questions = JSON.parse(cleaned);
    } catch (err) {
      console.error('Raw Gemini response:', rawText);
      throw new Error('Failed to parse Gemini response');
    }

    return questions;
  }
}
