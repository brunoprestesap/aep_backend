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
exports.HazardsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
let HazardsService = class HazardsService {
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async create(dto, tenantId, userId, userName) {
        const assessment = await this.prisma.assessment.findFirst({
            where: { id: dto.assessmentId, tenantId, deletedAt: null },
        });
        if (!assessment)
            throw new common_1.NotFoundException('Assessment not found');
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
    async list(assessmentId, tenantId, category) {
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
    async get(id, tenantId) {
        const hazard = await this.prisma.hazard.findFirst({
            where: { id, tenantId },
            include: { catalog: true, activity: true, riskAssessments: true },
        });
        if (!hazard)
            throw new common_1.NotFoundException('Hazard not found');
        return hazard;
    }
    async update(id, dto, tenantId, userId, userName) {
        await this.get(id, tenantId);
        const updated = await this.prisma.hazard.update({ where: { id }, data: dto });
        await this.audit.log({
            tenantId,
            userId,
            userName,
            action: 'hazard.updated',
            resourceType: 'hazard',
            resourceId: id,
            metadata: dto,
        });
        return updated;
    }
    async remove(id, tenantId, userId, userName) {
        const hazard = await this.get(id, tenantId);
        if (hazard.riskAssessments.length > 0) {
            throw new common_1.ForbiddenException('Cannot delete a hazard that has risk assessments. Remove them first.');
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
    async listCatalog(tenantId, category) {
        return this.prisma.hazardCatalog.findMany({
            where: {
                OR: [{ isGlobal: true }, { tenantId }],
                ...(category && { category }),
            },
            orderBy: [{ category: 'asc' }, { name: 'asc' }],
        });
    }
    async createCatalogEntry(dto, tenantId, userId, userName) {
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
};
exports.HazardsService = HazardsService;
exports.HazardsService = HazardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], HazardsService);
//# sourceMappingURL=hazards.service.js.map