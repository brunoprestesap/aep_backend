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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let DashboardService = class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats(tenantId) {
        const now = new Date();
        const [organizationsCount, activeAssessmentsCount, criticalRisksCount, pendingActionsCount, recentAssessments, upcomingDeadlines,] = await Promise.all([
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
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map