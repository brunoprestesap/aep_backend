import { Injectable, NotFoundException } from '@nestjs/common';
import { ActionItemStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export interface CreateActionPlanDto {
  assessmentId: string;
  riskAssessmentId?: string;
  title: string;
  objective?: string;
}

export interface UpdateActionPlanDto {
  title?: string;
  objective?: string;
}

export interface CreateActionItemDto {
  action: string;
  responsibleName: string;
  dueDate: Date;
  successIndicators?: string;
}

export interface UpdateActionItemDto {
  action?: string;
  responsibleName?: string;
  dueDate?: Date;
  successIndicators?: string;
  status?: ActionItemStatus;
}

@Injectable()
export class ActionPlansService {
  constructor(private readonly prisma: PrismaService) {}

  async createPlan(dto: CreateActionPlanDto, tenantId: string) {
    return this.prisma.actionPlan.create({ data: { ...dto, tenantId } });
  }

  async listPlans(assessmentId: string, tenantId: string) {
    return this.prisma.actionPlan.findMany({
      where: { assessmentId, tenantId },
      include: {
        items: true,
        riskAssessment: {
          include: { hazard: { select: { id: true, name: true, category: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPlan(id: string, tenantId: string) {
    const plan = await this.prisma.actionPlan.findFirst({
      where: { id, tenantId },
      include: {
        items: { orderBy: { createdAt: 'asc' } },
        riskAssessment: {
          include: { hazard: { select: { id: true, name: true, category: true } } },
        },
      },
    });
    if (!plan) throw new NotFoundException('Action plan not found');
    return plan;
  }

  async updatePlan(id: string, dto: UpdateActionPlanDto, tenantId: string) {
    await this.getPlan(id, tenantId);
    return this.prisma.actionPlan.update({ where: { id }, data: dto });
  }

  async deletePlan(id: string, tenantId: string) {
    await this.getPlan(id, tenantId);
    // Delete items first, then the plan
    await this.prisma.actionItem.deleteMany({ where: { actionPlanId: id } });
    return this.prisma.actionPlan.delete({ where: { id } });
  }

  async addItem(planId: string, dto: CreateActionItemDto, tenantId: string) {
    await this.getPlan(planId, tenantId);
    return this.prisma.actionItem.create({ data: { ...dto, actionPlanId: planId, tenantId } });
  }

  async updateItem(planId: string, itemId: string, dto: UpdateActionItemDto, tenantId: string) {
    const item = await this.prisma.actionItem.findFirst({
      where: { id: itemId, actionPlanId: planId, tenantId },
    });
    if (!item) throw new NotFoundException('Action item not found');

    const extra: Record<string, unknown> = {};
    if (dto.status === 'completed') extra.completedAt = new Date();
    if (dto.status && dto.status !== 'completed') extra.completedAt = null;

    return this.prisma.actionItem.update({ where: { id: itemId }, data: { ...dto, ...extra } });
  }

  async updateItemStatus(itemId: string, status: ActionItemStatus, tenantId: string) {
    const item = await this.prisma.actionItem.findFirst({ where: { id: itemId, tenantId } });
    if (!item) throw new NotFoundException('Action item not found');

    const extra = status === 'completed' ? { completedAt: new Date() } : {};
    return this.prisma.actionItem.update({ where: { id: itemId }, data: { status, ...extra } });
  }

  async deleteItem(planId: string, itemId: string, tenantId: string) {
    const item = await this.prisma.actionItem.findFirst({
      where: { id: itemId, actionPlanId: planId, tenantId },
    });
    if (!item) throw new NotFoundException('Action item not found');

    return this.prisma.actionItem.delete({ where: { id: itemId } });
  }
}
