import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotRequestDto } from './dto/chatbot-request.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @UseGuards(JwtAuthGuard)
  @Post('respond')
  async respond(@Body() dto: ChatbotRequestDto) {
    const response = await this.chatbotService.getExplanation(dto);
    return { reply: response };
  }
}
