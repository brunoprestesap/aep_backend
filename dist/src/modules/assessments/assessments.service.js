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
exports.AssessmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AssessmentsService = class AssessmentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, tenantId) {
        return this.prisma.assessment.create({ data: { ...dto, tenantId } });
    }
    async list(tenantId, organizationId) {
        return this.prisma.assessment.findMany({
            where: { tenantId, deletedAt: null, ...(organizationId && { organizationId }) },
            orderBy: { createdAt: 'desc' },
        });
    }
    async get(id, tenantId) {
        const assessment = await this.prisma.assessment.findFirst({
            where: { id, tenantId, deletedAt: null },
            include: { activities: true },
        });
        if (!assessment)
            throw new common_1.NotFoundException('Assessment not found');
        return assessment;
    }
    async updateStatus(id, status, tenantId) {
        await this.get(id, tenantId);
        const extra = {};
        if (status === 'in_progress')
            extra.startedAt = new Date();
        if (status === 'completed')
            extra.completedAt = new Date();
        return this.prisma.assessment.update({ where: { id }, data: { status, ...extra } });
    }
    async remove(id, tenantId) {
        await this.get(id, tenantId);
        return this.prisma.assessment.update({ where: { id }, data: { deletedAt: new Date() } });
    }
    async addActivity(assessmentId, dto, tenantId) {
        await this.get(assessmentId, tenantId);
        return this.prisma.activity.create({ data: { ...dto, assessmentId, tenantId } });
    }
    async listActivities(assessmentId, tenantId) {
        return this.prisma.activity.findMany({ where: { assessmentId, tenantId } });
    }
};
exports.AssessmentsService = AssessmentsService;
exports.AssessmentsService = AssessmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AssessmentsService);
//# sourceMappingURL=assessments.service.js.map