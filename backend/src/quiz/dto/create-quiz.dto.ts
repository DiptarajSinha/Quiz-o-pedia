import {
  IsString,
  IsArray,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  questionText: string;

  @IsArray()
  @IsString({ each: true })
  options: string[];

  @IsNumber()
  @Min(0)
  @Max(10)
  correctAnswerIndex: number;
}

export class CreateQuizDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}
