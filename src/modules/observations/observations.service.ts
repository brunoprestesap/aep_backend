import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CreateObservationDto {
  assessmentId: string;
  activityId?: string;
  observedAt: Date;
  description: string;
  workConditions?: string;
  workerCountPresent?: number;
  location?: string;
}

@Injectable()
export class ObservationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateObservationDto, observedBy: string, tenantId: string) {
    return this.prisma.observation.create({ data: { ...dto, observedBy, tenantId } });
  }

  async list(assessmentId: string, tenantId: string) {
    return this.prisma.observation.findMany({ where: { assessmentId, tenantId } });
  }

  async get(id: string, tenantId: string) {
    const obs = await this.prisma.observation.findFirst({ where: { id, tenantId } });
    if (!obs) throw new NotFoundException('Observation not found');
    return obs;
  }
}
