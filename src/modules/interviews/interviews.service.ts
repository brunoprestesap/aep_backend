import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CreateInterviewDto {
  assessmentId: string;
  intervieweeName: string;
  intervieweeRole?: string;
  conductedAt: Date;
  answers?: Record<string, string>;
  notes?: string;
}

@Injectable()
export class InterviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateInterviewDto, conductedBy: string, tenantId: string) {
    return this.prisma.interview.create({ data: { ...dto, conductedBy, tenantId } });
  }

  async list(assessmentId: string, tenantId: string) {
    return this.prisma.interview.findMany({ where: { assessmentId, tenantId } });
  }

  async get(id: string, tenantId: string) {
    const interview = await this.prisma.interview.findFirst({ where: { id, tenantId } });
    if (!interview) throw new NotFoundException('Interview not found');
    return interview;
  }
}
