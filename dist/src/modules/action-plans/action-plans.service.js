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
exports.ActionPlansService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ActionPlansService = class ActionPlansService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPlan(dto, tenantId) {
        return this.prisma.actionPlan.create({ data: { ...dto, tenantId } });
    }
    async listPlans(assessmentId, tenantId) {
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
    async getPlan(id, tenantId) {
        const plan = await this.prisma.actionPlan.findFirst({
            where: { id, tenantId },
            include: {
                items: { orderBy: { createdAt: 'asc' } },
                riskAssessment: {
                    include: { hazard: { select: { id: true, name: true, category: true } } },
                },
            },
        });
        if (!plan)
            throw new common_1.NotFoundException('Action plan not found');
        return plan;
    }
    async updatePlan(id, dto, tenantId) {
        await this.getPlan(id, tenantId);
        return this.prisma.actionPlan.update({ where: { id }, data: dto });
    }
    async deletePlan(id, tenantId) {
        await this.getPlan(id, tenantId);
        await this.prisma.actionItem.deleteMany({ where: { actionPlanId: id } });
        return this.prisma.actionPlan.delete({ where: { id } });
    }
    async addItem(planId, dto, tenantId) {
        await this.getPlan(planId, tenantId);
        return this.prisma.actionItem.create({ data: { ...dto, actionPlanId: planId, tenantId } });
    }
    async updateItem(planId, itemId, dto, tenantId) {
        const item = await this.prisma.actionItem.findFirst({
            where: { id: itemId, actionPlanId: planId, tenantId },
        });
        if (!item)
            throw new common_1.NotFoundException('Action item not found');
        const extra = {};
        if (dto.status === 'completed')
            extra.completedAt = new Date();
        if (dto.status && dto.status !== 'completed')
            extra.completedAt = null;
        return this.prisma.actionItem.update({ where: { id: itemId }, data: { ...dto, ...extra } });
    }
    async updateItemStatus(itemId, status, tenantId) {
        const item = await this.prisma.actionItem.findFirst({ where: { id: itemId, tenantId } });
        if (!item)
            throw new common_1.NotFoundException('Action item not found');
        const extra = status === 'completed' ? { completedAt: new Date() } : {};
        return this.prisma.actionItem.update({ where: { id: itemId }, data: { status, ...extra } });
    }
    async deleteItem(planId, itemId, tenantId) {
        const item = await this.prisma.actionItem.findFirst({
            where: { id: itemId, actionPlanId: planId, tenantId },
        });
        if (!item)
            throw new common_1.NotFoundException('Action item not found');
        return this.prisma.actionItem.delete({ where: { id: itemId } });
    }
};
exports.ActionPlansService = ActionPlansService;
exports.ActionPlansService = ActionPlansService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ActionPlansService);
//# sourceMappingURL=action-plans.service.js.map