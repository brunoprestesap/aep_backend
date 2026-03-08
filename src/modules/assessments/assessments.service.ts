import { Injectable, NotFoundException } from '@nestjs/common';
import { AssessmentStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { CreateActivityDto } from './dto/create-activity.dto';

@Injectable()
export class AssessmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAssessmentDto, tenantId: string) {
    return this.prisma.assessment.create({ data: { ...dto, tenantId } });
  }

  async list(tenantId: string, organizationId?: string) {
    return this.prisma.assessment.findMany({
      where: { tenantId, deletedAt: null, ...(organizationId && { organizationId }) },
      orderBy: { createdAt: 'desc' },
    });
  }

  async get(id: string, tenantId: string) {
    const assessment = await this.prisma.assessment.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: { activities: true },
    });
    if (!assessment) throw new NotFoundException('Assessment not found');
    return assessment;
  }

  async updateStatus(id: string, status: AssessmentStatus, tenantId: string) {
    await this.get(id, tenantId);
    const extra: Record<string, Date> = {};
    if (status === 'in_progress') extra.startedAt = new Date();
    if (status === 'completed') extra.completedAt = new Date();
    return this.prisma.assessment.update({ where: { id }, data: { status, ...extra } });
  }

  async remove(id: string, tenantId: string) {
    await this.get(id, tenantId);
    return this.prisma.assessment.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async addActivity(assessmentId: string, dto: CreateActivityDto, tenantId: string) {
    await this.get(assessmentId, tenantId);
    return this.prisma.activity.create({ data: { ...dto, assessmentId, tenantId } });
  }

  async listActivities(assessmentId: string, tenantId: string) {
    return this.prisma.activity.findMany({ where: { assessmentId, tenantId } });
  }
}
