import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { ResultsService } from './results.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  // ✅ Secure endpoint to fetch results for logged-in user (used by frontend)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyResults(@Request() req) {
    return this.resultsService.getResultsForUser(req.user.sub);
  }

  // Optional: Keep this if you want to allow fetching by userId (with extra auth check)
  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  async getUserResults(@Param('userId') userId: string, @Request() req) {
    if (req.user.sub !== userId) {
      throw new ForbiddenException('You are not allowed to view these results.');
    }

    return this.resultsService.getResultsForUser(userId);
  }
}
