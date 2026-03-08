import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { RiskLevel } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { classifyRisk } from './risk-classifier';
import { CreateRiskAssessmentDto } from './dto/create-risk-assessment.dto';
import { UpdateRiskAssessmentDto } from './dto/update-risk-assessment.dto';
import { UpdateResidualRiskDto } from './dto/update-residual-risk.dto';

@Injectable()
export class RiskEngineService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async classify(dto: CreateRiskAssessmentDto, tenantId: string, userId: string, userName: string) {
    const assessment = await this.prisma.assessment.findFirst({
      where: { id: dto.assessmentId, tenantId, deletedAt: null },
    });
    if (!assessment) throw new NotFoundException('Assessment not found');

    const hazard = await this.prisma.hazard.findFirst({
      where: { id: dto.hazardId, tenantId, assessmentId: dto.assessmentId },
    });
    if (!hazard) throw new NotFoundException('Hazard not found in this assessment');

    const { score, level } = classifyRisk(dto.severity, dto.probability);

    const ra = await this.prisma.riskAssessment.create({
      data: { ...dto, tenantId, riskScore: score, riskLevel: level },
      include: { hazard: true },
    });

    await this.audit.log({
      tenantId,
      userId,
      userName,
      action: 'risk_assessment.created',
      resourceType: 'risk_assessment',
      resourceId: ra.id,
      metadata: {
        assessmentId: dto.assessmentId,
        hazardId: dto.hazardId,
        severity: dto.severity,
        probability: dto.probability,
        riskLevel: level,
        riskScore: score,
      },
    });

    return ra;
  }

  async listByAssessment(assessmentId: string, tenantId: string, riskLevel?: RiskLevel) {
    return this.prisma.riskAssessment.findMany({
      where: {
        assessmentId,
        tenantId,
        ...(riskLevel && { riskLevel }),
      },
      include: {
        hazard: { include: { catalog: true } },
        actionPlans: { select: { id: true, title: true } },
      },
      orderBy: { riskScore: 'desc' },
    });
  }

  async get(id: string, tenantId: string) {
    const ra = await this.prisma.riskAssessment.findFirst({
      where: { id, tenantId },
      include: {
        hazard: { include: { catalog: true, activity: true } },
        actionPlans: true,
      },
    });
    if (!ra) throw new NotFoundException('Risk assessment not found');
    return ra;
  }

  async update(
    id: string,
    dto: UpdateRiskAssessmentDto,
    tenantId: string,
    userId: string,
    userName: string,
  ) {
    const ra = await this.get(id, tenantId);

    const needsReclassification = dto.severity !== undefined || dto.probability !== undefined;
    const severity = dto.severity ?? ra.severity;
    const probability = dto.probability ?? ra.probability;

    const { score, level } = needsReclassification
      ? classifyRisk(severity, probability)
      : { score: ra.riskScore, level: ra.riskLevel };

    const updated = await this.prisma.riskAssessment.update({
      where: { id },
      data: {
        ...(dto.severity && { severity: dto.severity }),
        ...(dto.probability && { probability: dto.probability }),
        ...(dto.justification !== undefined && { justification: dto.justification }),
        ...(needsReclassification && { riskScore: score, riskLevel: level }),
      },
      include: { hazard: true },
    });

    await this.audit.log({
      tenantId,
      userId,
      userName,
      action: 'risk_assessment.updated',
      resourceType: 'risk_assessment',
      resourceId: id,
      metadata: {
        ...dto,
        ...(needsReclassification && { riskLevel: level, riskScore: score }),
      },
    });

    return updated;
  }

  async updateResidualRisk(
    id: string,
    dto: UpdateResidualRiskDto,
    tenantId: string,
    userId: string,
    userName: string,
  ) {
    await this.get(id, tenantId);

    const { score, level } = classifyRisk(dto.residualSeverity, dto.residualProbability);

    const updated = await this.prisma.riskAssessment.update({
      where: { id },
      data: {
        residualSeverity: dto.residualSeverity,
        residualProbability: dto.residualProbability,
        residualScore: score,
        residualLevel: level,
      },
      include: { hazard: true },
    });

    await this.audit.log({
      tenantId,
      userId,
      userName,
      action: 'risk_assessment.residual_updated',
      resourceType: 'risk_assessment',
      resourceId: id,
      metadata: {
        residualSeverity: dto.residualSeverity,
        residualProbability: dto.residualProbability,
        residualLevel: level,
        residualScore: score,
      },
    });

    return updated;
  }

  async remove(id: string, tenantId: string, userId: string, userName: string) {
    const ra = await this.get(id, tenantId);

    if (ra.actionPlans.length > 0) {
      throw new BadRequestException(
        'Cannot delete a risk assessment that has action plans. Remove them first.',
      );
    }

    await this.prisma.riskAssessment.delete({ where: { id } });

    await this.audit.log({
      tenantId,
      userId,
      userName,
      action: 'risk_assessment.deleted',
      resourceType: 'risk_assessment',
      resourceId: id,
      metadata: { assessmentId: ra.assessmentId, hazardId: ra.hazardId, riskLevel: ra.riskLevel },
    });
  }

  async getSummaryByAssessment(assessmentId: string, tenantId: string) {
    const assessment = await this.prisma.assessment.findFirst({
      where: { id: assessmentId, tenantId, deletedAt: null },
    });
    if (!assessment) throw new NotFoundException('Assessment not found');

    const counts = await this.prisma.riskAssessment.groupBy({
      by: ['riskLevel'],
      where: { assessmentId, tenantId },
      _count: { id: true },
    });

    const summary: Record<string, number> = { low: 0, medium: 0, high: 0, critical: 0 };
    for (const row of counts) {
      summary[row.riskLevel] = row._count.id;
    }

    return summary;
  }
}
