"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurveysService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
const DIMENSIONS = [
    'workload',
    'autonomy',
    'leadership_support',
    'peer_relationships',
    'recognition',
    'communication',
    'psychological_pressure',
    'wellbeing',
];
const DIMENSION_LABELS = {
    workload: 'Carga de Trabalho',
    autonomy: 'Autonomia',
    leadership_support: 'Suporte da Liderança',
    peer_relationships: 'Relações com Colegas',
    recognition: 'Reconhecimento',
    communication: 'Comunicação',
    psychological_pressure: 'Pressão Psicológica',
    wellbeing: 'Bem-estar',
};
function classifyRiskLevel(avg) {
    if (avg <= 2)
        return 'low';
    if (avg <= 3)
        return 'attention';
    if (avg <= 4)
        return 'medium';
    return 'high';
}
let SurveysService = class SurveysService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, tenantId) {
        const accessToken = (0, crypto_1.randomBytes)(16).toString('hex');
        return this.prisma.survey.create({
            data: { ...dto, tenantId, accessToken },
            include: {
                _count: { select: { responses: true } },
                assessment: { select: { title: true } },
            },
        });
    }
    async list(tenantId, assessmentId) {
        return this.prisma.survey.findMany({
            where: { tenantId, ...(assessmentId ? { assessmentId } : {}) },
            include: {
                _count: { select: { responses: true } },
                assessment: { select: { title: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async get(id, tenantId) {
        const survey = await this.prisma.survey.findFirst({
            where: { id, tenantId },
            include: {
                _count: { select: { responses: true } },
                assessment: { select: { title: true } },
            },
        });
        if (!survey)
            throw new common_1.NotFoundException('Survey not found');
        return survey;
    }
    async getByToken(accessToken) {
        const survey = await this.prisma.survey.findFirst({ where: { accessToken } });
        if (!survey)
            throw new common_1.NotFoundException('Survey not found');
        return {
            id: survey.id,
            title: survey.title,
            description: survey.description,
            isAnonymous: survey.isAnonymous,
            closesAt: survey.closesAt,
        };
    }
    async submitResponse(accessToken, answers) {
        const survey = await this.prisma.survey.findFirst({ where: { accessToken } });
        if (!survey)
            throw new common_1.NotFoundException('Survey not found');
        if (survey.closesAt && survey.closesAt < new Date()) {
            throw new common_1.BadRequestException('Survey is closed');
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
    async getAggregatedResults(surveyId, tenantId) {
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
                    riskLevel: 'low',
                    responseCount: 0,
                })),
            };
        }
        const totals = {};
        DIMENSIONS.forEach((d) => (totals[d] = 0));
        for (const r of responses) {
            const ans = r.answers;
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
};
exports.SurveysService = SurveysService;
exports.SurveysService = SurveysService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SurveysService);
//# sourceMappingURL=surveys.service.js.map