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
var ReportProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const reporting_service_1 = require("../reporting.service");
let ReportProcessor = ReportProcessor_1 = class ReportProcessor {
    constructor() {
        this.logger = new common_1.Logger(ReportProcessor_1.name);
    }
    async handleGenerate(job) {
        const { reportId, tenantId } = job.data;
        this.logger.log(`Generating report ${reportId} for tenant ${tenantId}`);
    }
};
exports.ReportProcessor = ReportProcessor;
__decorate([
    (0, bull_1.Process)('generate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportProcessor.prototype, "handleGenerate", null);
exports.ReportProcessor = ReportProcessor = ReportProcessor_1 = __decorate([
    (0, bull_1.Processor)(reporting_service_1.REPORT_QUEUE)
], ReportProcessor);
//# sourceMappingURL=report.processor.js.map