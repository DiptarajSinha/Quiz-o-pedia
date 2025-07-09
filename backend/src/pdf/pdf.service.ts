import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { Response } from 'express';
import { createWriteStream } from 'fs';
import * as path from 'path';

@Injectable()
export class PdfService {
  async generateReport(data: any, res: Response) {
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=report-${data.quizId}.pdf`);

    doc.pipe(res);

    doc.fontSize(20).text(`Quiz Report Card`, { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`User: ${data.userName}`);
    doc.text(`Quiz Title: ${data.quizTitle}`);
    doc.text(`Score: ${data.score} / ${data.totalQuestions}`);
    doc.moveDown();

    doc.fontSize(14).text(`Detailed Feedback:`);
    data.feedback.forEach((f: any, idx: number) => {
      doc
        .fontSize(12)
        .text(
          `Q${idx + 1}: ${f.question}\nSelected: ${f.selected}\nCorrect: ${f.correct}\nResult: ${
            f.isCorrect ? '✅ Correct' : '❌ Wrong'
          }\n`,
        )
        .moveDown();
    });

    doc.end();
  }
}
