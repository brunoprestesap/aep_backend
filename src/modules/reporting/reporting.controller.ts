import * as fs from 'fs';
import * as path from 'path';

import { Controller, Get, Post, Body, Param, ParseUUIDPipe, UseGuards, Res, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { ReportingService, RequestReportDto } from './reporting.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '@prisma/client';

const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads', 'reports');

const MIME_TYPES: Record<string, string> = {
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportingController {
  constructor(private readonly service: ReportingService) {}

  @Post()
  request(@Body() dto: RequestReportDto, @CurrentUser() user: User) {
    return this.service.request(dto, user.id, user.tenantId);
  }

  @Get('assessment/:assessmentId')
  list(
    @Param('assessmentId', ParseUUIDPipe) assessmentId: string,
    @CurrentUser() user: User,
  ) {
    return this.service.list(assessmentId, user.tenantId);
  }

  @Get(':id/download')
  async download(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    const report = await this.service.get(id, user.tenantId);
    if (report.status !== 'completed') {
      throw new NotFoundException('Report file not ready yet');
    }

    const ext = report.format; // pdf | docx | xlsx
    const filePath = path.join(UPLOADS_DIR, `${id}.${ext}`);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Report file not found on disk');
    }

    const mimeType = MIME_TYPES[report.format] ?? 'application/octet-stream';
    const downloadName = `relatorio-${report.type}-${id.slice(0, 8)}.${ext}`;

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
    fs.createReadStream(filePath).pipe(res);
  }

  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.service.get(id, user.tenantId);
  }
}
