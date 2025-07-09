import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ChatbotRequestDto } from './dto/chatbot-request.dto';

@Injectable()
export class ChatbotService {
  constructor(private readonly httpService: HttpService) {}

  async getExplanation(dto: ChatbotRequestDto): Promise<string> {
    const { userMessage, quiz, feedback } = dto;

    if (!feedback || !Array.isArray(feedback)) {
      throw new Error('Invalid or missing feedback data in request.');
    }
    console.log("Received ChatbotRequestDto:", dto);
    const feedbackSummary = feedback
      .map((f, index) => {
        const correctness = f.isCorrect
          ? '✅ Correct'
          : `❌ Wrong (You chose "${f.selected}", correct is "${f.correct}")`;
        return `Q${index + 1}: ${f.question}\n${correctness}`;
      })
      .join('\n\n');

    const prompt = `
You are a helpful quiz assistant. The user is asking: "${userMessage}"

Quiz Title: ${quiz?.title || 'Unknown'}

Feedback summary:
${feedbackSummary}

Respond helpfully, referring to specific questions when relevant.
    `.trim();

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

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    return text ?? 'Sorry, I could not generate a response.';
  }
}
