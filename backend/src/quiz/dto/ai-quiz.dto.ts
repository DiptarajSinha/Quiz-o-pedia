import { IsInt, IsString, Min } from 'class-validator';

export class AiQuizDto {
  @IsString()
  topic: string;

  @IsInt()
  @Min(1)
  numQuestions: number;
}
