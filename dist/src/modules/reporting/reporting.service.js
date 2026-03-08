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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportingService = exports.REPORT_QUEUE = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const prisma_service_1 = require("../../prisma/prisma.service");
exports.REPORT_QUEUE = 'report-generation';
let ReportingService = class ReportingService {
    constructor(prisma, reportQueue) {
        this.prisma = prisma;
        this.reportQueue = reportQueue;
    }
    async request(dto, requestedBy, tenantId) {
        const report = await this.prisma.report.create({
            data: { ...dto, requestedBy, tenantId },
        });
        await this.reportQueue.add('generate', { reportId: report.id, tenantId });
        return report;
    }
    async list(assessmentId, tenantId) {
        return this.prisma.report.findMany({
            where: { assessmentId, tenantId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async get(id, tenantId) {
        const report = await this.prisma.report.findFirst({ where: { id, tenantId } });
        if (!report)
            throw new common_1.NotFoundException('Report not found');
        return report;
    }
    async markCompleted(id, fileKey, fileUrl) {
        await this.prisma.report.update({
            where: { id },
            data: { status: 'completed', fileKey, fileUrl, completedAt: new Date() },
        });
    }
    async markFailed(id, errorMessage) {
        await this.prisma.report.update({ where: { id }, data: { status: 'failed', errorMessage } });
    }
};
exports.ReportingService = ReportingService;
exports.ReportingService = ReportingService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bull_1.InjectQueue)(exports.REPORT_QUEUE)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], ReportingService);
//# sourceMappingURL=reporting.service.js.map