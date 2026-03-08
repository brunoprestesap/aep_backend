import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ReportType, ReportFormat } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export interface RequestReportDto {
  assessmentId: string;
  type: ReportType;
  format: ReportFormat;
}

export const REPORT_QUEUE = 'report-generation';

@Injectable()
export class ReportingService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(REPORT_QUEUE) private readonly reportQueue: Queue,
  ) {}

  async request(dto: RequestReportDto, requestedBy: string, tenantId: string) {
    const report = await this.prisma.report.create({
      data: { ...dto, requestedBy, tenantId },
    });

    await this.reportQueue.add('generate', { reportId: report.id, tenantId });
    return report;
  }

  async list(assessmentId: string, tenantId: string) {
    return this.prisma.report.findMany({
      where: { assessmentId, tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async get(id: string, tenantId: string) {
    const report = await this.prisma.report.findFirst({ where: { id, tenantId } });
    if (!report) throw new NotFoundException('Report not found');
    return report;
  }

  async markCompleted(id: string, fileKey: string, fileUrl: string) {
    await this.prisma.report.update({
      where: { id },
      data: { status: 'completed', fileKey, fileUrl, completedAt: new Date() },
    });
  }

  async markFailed(id: string, errorMessage: string) {
    await this.prisma.report.update({ where: { id }, data: { status: 'failed', errorMessage } });
  }
}
