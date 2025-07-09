import { IsNotEmpty, IsArray, IsNumber } from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty()
  questionText: string;

  @IsArray()
  options: string[];

  @IsNumber()
  correctAnswerIndex: number;
}
