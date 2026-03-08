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
exports.RiskEngineService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
const risk_classifier_1 = require("./risk-classifier");
let RiskEngineService = class RiskEngineService {
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async classify(dto, tenantId, userId, userName) {
        const assessment = await this.prisma.assessment.findFirst({
            where: { id: dto.assessmentId, tenantId, deletedAt: null },
        });
        if (!assessment)
            throw new common_1.NotFoundException('Assessment not found');
        const hazard = await this.prisma.hazard.findFirst({
            where: { id: dto.hazardId, tenantId, assessmentId: dto.assessmentId },
        });
        if (!hazard)
            throw new common_1.NotFoundException('Hazard not found in this assessment');
        const { score, level } = (0, risk_classifier_1.classifyRisk)(dto.severity, dto.probability);
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
    async listByAssessment(assessmentId, tenantId, riskLevel) {
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
    async get(id, tenantId) {
        const ra = await this.prisma.riskAssessment.findFirst({
            where: { id, tenantId },
            include: {
                hazard: { include: { catalog: true, activity: true } },
                actionPlans: true,
            },
        });
        if (!ra)
            throw new common_1.NotFoundException('Risk assessment not found');
        return ra;
    }
    async update(id, dto, tenantId, userId, userName) {
        const ra = await this.get(id, tenantId);
        const needsReclassification = dto.severity !== undefined || dto.probability !== undefined;
        const severity = dto.severity ?? ra.severity;
        const probability = dto.probability ?? ra.probability;
        const { score, level } = needsReclassification
            ? (0, risk_classifier_1.classifyRisk)(severity, probability)
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
    async updateResidualRisk(id, dto, tenantId, userId, userName) {
        await this.get(id, tenantId);
        const { score, level } = (0, risk_classifier_1.classifyRisk)(dto.residualSeverity, dto.residualProbability);
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
    async remove(id, tenantId, userId, userName) {
        const ra = await this.get(id, tenantId);
        if (ra.actionPlans.length > 0) {
            throw new common_1.BadRequestException('Cannot delete a risk assessment that has action plans. Remove them first.');
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
    async getSummaryByAssessment(assessmentId, tenantId) {
        const assessment = await this.prisma.assessment.findFirst({
            where: { id: assessmentId, tenantId, deletedAt: null },
        });
        if (!assessment)
            throw new common_1.NotFoundException('Assessment not found');
        const counts = await this.prisma.riskAssessment.groupBy({
            by: ['riskLevel'],
            where: { assessmentId, tenantId },
            _count: { id: true },
        });
        const summary = { low: 0, medium: 0, high: 0, critical: 0 };
        for (const row of counts) {
            summary[row.riskLevel] = row._count.id;
        }
        return summary;
    }
};
exports.RiskEngineService = RiskEngineService;
exports.RiskEngineService = RiskEngineService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], RiskEngineService);
//# sourceMappingURL=risk-engine.service.js.map