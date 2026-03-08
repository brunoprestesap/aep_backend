import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { HazardCategory } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateHazardDto } from './dto/create-hazard.dto';
import { UpdateHazardDto } from './dto/update-hazard.dto';
import { CreateCatalogEntryDto } from './dto/create-catalog-entry.dto';

@Injectable()
export class HazardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async create(dto: CreateHazardDto, tenantId: string, userId: string, userName: string) {
    const assessment = await this.prisma.assessment.findFirst({
      where: { id: dto.assessmentId, tenantId, deletedAt: null },
    });
    if (!assessment) throw new NotFoundException('Assessment not found');

    const hazard = await this.prisma.hazard.create({ data: { ...dto, tenantId } });

    await this.audit.log({
      tenantId,
      userId,
      userName,
      action: 'hazard.created',
      resourceType: 'hazard',
      resourceId: hazard.id,
      metadata: { assessmentId: hazard.assessmentId, category: hazard.category },
    });

    return hazard;
  }

  async list(assessmentId: string, tenantId: string, category?: HazardCategory) {
    return this.prisma.hazard.findMany({
      where: {
        assessmentId,
        tenantId,
        ...(category && { category }),
      },
      include: { catalog: true, activity: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async get(id: string, tenantId: string) {
    const hazard = await this.prisma.hazard.findFirst({
      where: { id, tenantId },
      include: { catalog: true, activity: true, riskAssessments: true },
    });
    if (!hazard) throw new NotFoundException('Hazard not found');
    return hazard;
  }

  async update(
    id: string,
    dto: UpdateHazardDto,
    tenantId: string,
    userId: string,
    userName: string,
  ) {
    await this.get(id, tenantId);
    const updated = await this.prisma.hazard.update({ where: { id }, data: dto });

    await this.audit.log({
      tenantId,
      userId,
      userName,
      action: 'hazard.updated',
      resourceType: 'hazard',
      resourceId: id,
      metadata: dto as object,
    });

    return updated;
  }

  async remove(id: string, tenantId: string, userId: string, userName: string) {
    const hazard = await this.get(id, tenantId);

    if (hazard.riskAssessments.length > 0) {
      throw new ForbiddenException(
        'Cannot delete a hazard that has risk assessments. Remove them first.',
      );
    }

    await this.prisma.hazard.delete({ where: { id } });

    await this.audit.log({
      tenantId,
      userId,
      userName,
      action: 'hazard.deleted',
      resourceType: 'hazard',
      resourceId: id,
      metadata: { assessmentId: hazard.assessmentId, category: hazard.category },
    });
  }

  async listCatalog(tenantId: string, category?: HazardCategory) {
    return this.prisma.hazardCatalog.findMany({
      where: {
        OR: [{ isGlobal: true }, { tenantId }],
        ...(category && { category }),
      },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
  }

  async createCatalogEntry(
    dto: CreateCatalogEntryDto,
    tenantId: string,
    userId: string,
    userName: string,
  ) {
    const entry = await this.prisma.hazardCatalog.create({
      data: { ...dto, tenantId, isGlobal: false },
    });

    await this.audit.log({
      tenantId,
      userId,
      userName,
      action: 'hazard_catalog.created',
      resourceType: 'hazard_catalog',
      resourceId: entry.id,
      metadata: { category: entry.category, name: entry.name },
    });

    return entry;
  }
}
