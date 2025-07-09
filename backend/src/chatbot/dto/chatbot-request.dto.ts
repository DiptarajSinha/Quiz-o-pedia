import { IsString, IsOptional, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

class QuizQuestionDto {
  @IsString()
  text: string;

  @IsArray()
  @IsString({ each: true })
  options: string[];
}

class QuizDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizQuestionDto)
  questions: QuizQuestionDto[];
}

class FeedbackItemDto {
  @IsString()
  question: string;

  @IsOptional()
  @IsString()
  selected?: string;

  @IsString()
  correct: string;

  @IsBoolean()
  isCorrect: boolean;
}

export class ChatbotRequestDto {
  @IsString()
  userMessage: string;

  @ValidateNested()
  @Type(() => QuizDto)
  quiz: QuizDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeedbackItemDto)
  feedback: FeedbackItemDto[];
}
