import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';

export interface CreateSurveyDto {
  assessmentId: string;
  title: string;
  description?: string;
  targetJobRoleId?: string;
  isAnonymous?: boolean;
  closesAt?: Date;
}

const DIMENSIONS = [
  'workload',
  'autonomy',
  'leadership_support',
  'peer_relationships',
  'recognition',
  'communication',
  'psychological_pressure',
  'wellbeing',
] as const;

type Dimension = (typeof DIMENSIONS)[number];

const DIMENSION_LABELS: Record<Dimension, string> = {
  workload: 'Carga de Trabalho',
  autonomy: 'Autonomia',
  leadership_support: 'Suporte da Liderança',
  peer_relationships: 'Relações com Colegas',
  recognition: 'Reconhecimento',
  communication: 'Comunicação',
  psychological_pressure: 'Pressão Psicológica',
  wellbeing: 'Bem-estar',
};

function classifyRiskLevel(avg: number): 'low' | 'attention' | 'medium' | 'high' {
  if (avg <= 2) return 'low';
  if (avg <= 3) return 'attention';
  if (avg <= 4) return 'medium';
  return 'high';
}

@Injectable()
export class SurveysService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSurveyDto, tenantId: string) {
    const accessToken = randomBytes(16).toString('hex');
    return this.prisma.survey.create({
      data: { ...dto, tenantId, accessToken },
      include: {
        _count: { select: { responses: true } },
        assessment: { select: { title: true } },
      },
    });
  }

  async list(tenantId: string, assessmentId?: string) {
    return this.prisma.survey.findMany({
      where: { tenantId, ...(assessmentId ? { assessmentId } : {}) },
      include: {
        _count: { select: { responses: true } },
        assessment: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async get(id: string, tenantId: string) {
    const survey = await this.prisma.survey.findFirst({
      where: { id, tenantId },
      include: {
        _count: { select: { responses: true } },
        assessment: { select: { title: true } },
      },
    });
    if (!survey) throw new NotFoundException('Survey not found');
    return survey;
  }

  async getByToken(accessToken: string) {
    const survey = await this.prisma.survey.findFirst({ where: { accessToken } });
    if (!survey) throw new NotFoundException('Survey not found');
    return {
      id: survey.id,
      title: survey.title,
      description: survey.description,
      isAnonymous: survey.isAnonymous,
      closesAt: survey.closesAt,
    };
  }

  async submitResponse(accessToken: string, answers: Record<string, number>) {
    const survey = await this.prisma.survey.findFirst({ where: { accessToken } });
    if (!survey) throw new NotFoundException('Survey not found');
    if (survey.closesAt && survey.closesAt < new Date()) {
      throw new BadRequestException('Survey is closed');
    }

    await this.prisma.surveyResponse.create({
      data: {
        surveyId: survey.id,
        tenantId: survey.tenantId,
        answers,
        submittedAt: new Date(),
      },
    });

    return { message: 'Response submitted' };
  }

  async getAggregatedResults(surveyId: string, tenantId: string) {
    await this.get(surveyId, tenantId);
    const responses = await this.prisma.surveyResponse.findMany({
      where: { surveyId, tenantId },
    });

    if (responses.length === 0) {
      return {
        surveyId,
        totalResponses: 0,
        responseRate: 0,
        dimensions: DIMENSIONS.map((d) => ({
          dimension: d,
          label: DIMENSION_LABELS[d],
          average: 0,
          riskLevel: 'low' as const,
          responseCount: 0,
        })),
      };
    }

    const totals: Record<string, number> = {};
    DIMENSIONS.forEach((d) => (totals[d] = 0));

    for (const r of responses) {
      const ans = r.answers as Record<string, number>;
      DIMENSIONS.forEach((d) => {
        totals[d] += ans[d] ?? 0;
      });
    }

    const dimensions = DIMENSIONS.map((d) => {
      const avg = parseFloat((totals[d] / responses.length).toFixed(2));
      return {
        dimension: d,
        label: DIMENSION_LABELS[d],
        average: avg,
        riskLevel: classifyRiskLevel(avg),
        responseCount: responses.length,
      };
    });

    return { surveyId, totalResponses: responses.length, responseRate: 0, dimensions };
  }
}
