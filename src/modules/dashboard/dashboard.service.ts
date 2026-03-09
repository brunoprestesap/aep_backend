import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(tenantId: string) {
    const now = new Date();

    const [
      organizationsCount,
      activeAssessmentsCount,
      criticalRisksCount,
      pendingActionsCount,
      recentAssessments,
      upcomingDeadlines,
    ] = await Promise.all([
      this.prisma.organization.count({
        where: { tenantId, deletedAt: null },
      }),

      this.prisma.assessment.count({
        where: { tenantId, status: 'in_progress', deletedAt: null },
      }),

      this.prisma.riskAssessment.count({
        where: { tenantId, riskLevel: 'critical' },
      }),

      this.prisma.actionItem.count({
        where: { tenantId, status: { in: ['pending', 'in_progress'] } },
      }),

      this.prisma.assessment.findMany({
        where: { tenantId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          organization: { select: { id: true, name: true } },
        },
      }),

      this.prisma.actionItem.findMany({
        where: {
          tenantId,
          status: { in: ['pending', 'in_progress'] },
          dueDate: { gte: now },
        },
        orderBy: { dueDate: 'asc' },
        take: 5,
        select: {
          id: true,
          action: true,
          responsibleName: true,
          dueDate: true,
          status: true,
          actionPlan: {
            select: {
              id: true,
              title: true,
              assessment: { select: { id: true, title: true } },
            },
          },
        },
      }),
    ]);

    return {
      organizationsCount,
      activeAssessmentsCount,
      criticalRisksCount,
      pendingActionsCount,
      recentAssessments,
      upcomingDeadlines,
    };
  }
}
