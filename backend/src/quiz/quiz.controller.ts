import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { AiQuizDto } from './dto/ai-quiz.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ParseUUIDPipe } from '@nestjs/common';

@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  // 🔐 Admin: Manually create quiz
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizService.create(createQuizDto);
  }

  // 🤖 Admin: Generate quiz via Gemini
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('generate-ai')
  async generateAiQuiz(@Body() aiQuizDto: AiQuizDto) {
    return this.quizService.generateQuizUsingGemini(aiQuizDto);
  }

  // ✅ Admin: Confirm and save AI-generated quiz
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('confirm-ai')
  async confirmAndSaveAiQuiz(@Body() createQuizDto: CreateQuizDto) {
    return this.quizService.create(createQuizDto);
  }

  // 📄 Public: Get all quizzes
  @Get()
  async findAll() {
    return this.quizService.findAll();
  }

  @UseGuards(JwtAuthGuard)
@Get('/user/with-status')
async getUserQuizStatus(@Req() req) {
  const userId = req.user.sub;
  return this.quizService.findAllWithUserStatus(userId);
}


  // 📄 Public: Get single quiz by ID
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
  return this.quizService.findOne(id);
}

  // 📝 User: Submit quiz with userId extracted from JWT
  @UseGuards(JwtAuthGuard)
  @Post(':id/submit')
  async submitQuiz(
    @Param('id') quizId: string,
    @Body() submitQuizDto: SubmitQuizDto,
    @Req() req: any,
  ) {
  return this.quizService.evaluateQuiz(quizId, submitQuizDto.answers, req.user?.sub);
  }
}
