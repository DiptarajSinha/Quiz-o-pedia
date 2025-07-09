import { Controller, Post, Res, Body } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { Response } from 'express';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('report')
  async getPdf(@Res() res: Response, @Body() body: any) {
    return this.pdfService.generateReport(body, res);
  }
}
