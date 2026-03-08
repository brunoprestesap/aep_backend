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
exports.RiskEngineController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const risk_engine_service_1 = require("./risk-engine.service");
const create_risk_assessment_dto_1 = require("./dto/create-risk-assessment.dto");
const update_risk_assessment_dto_1 = require("./dto/update-risk-assessment.dto");
const update_residual_risk_dto_1 = require("./dto/update-residual-risk.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let RiskEngineController = class RiskEngineController {
    constructor(service) {
        this.service = service;
    }
    classify(dto, user) {
        return this.service.classify(dto, user.tenantId, user.id, user.name);
    }
    listByAssessment(assessmentId, user, riskLevel) {
        return this.service.listByAssessment(assessmentId, user.tenantId, riskLevel);
    }
    getSummary(assessmentId, user) {
        return this.service.getSummaryByAssessment(assessmentId, user.tenantId);
    }
    get(id, user) {
        return this.service.get(id, user.tenantId);
    }
    update(id, dto, user) {
        return this.service.update(id, dto, user.tenantId, user.id, user.name);
    }
    updateResidual(id, dto, user) {
        return this.service.updateResidualRisk(id, dto, user.tenantId, user.id, user.name);
    }
    remove(id, user) {
        return this.service.remove(id, user.tenantId, user.id, user.name);
    }
};
exports.RiskEngineController = RiskEngineController;
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_risk_assessment_dto_1.CreateRiskAssessmentDto, Object]),
    __metadata("design:returntype", void 0)
], RiskEngineController.prototype, "classify", null);
__decorate([
    (0, common_1.Get)('assessment/:assessmentId'),
    (0, swagger_1.ApiQuery)({ name: 'riskLevel', enum: client_1.RiskLevel, required: false }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('assessmentId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)('riskLevel')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], RiskEngineController.prototype, "listByAssessment", null);
__decorate([
    (0, common_1.Get)('assessment/:assessmentId/summary'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('assessmentId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RiskEngineController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RiskEngineController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_risk_assessment_dto_1.UpdateRiskAssessmentDto, Object]),
    __metadata("design:returntype", void 0)
], RiskEngineController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/residual'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_residual_risk_dto_1.UpdateResidualRiskDto, Object]),
    __metadata("design:returntype", void 0)
], RiskEngineController.prototype, "updateResidual", null);
__decorate([
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RiskEngineController.prototype, "remove", null);
exports.RiskEngineController = RiskEngineController = __decorate([
    (0, swagger_1.ApiTags)('risk-assessments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('risk-assessments'),
    __metadata("design:paramtypes", [risk_engine_service_1.RiskEngineService])
], RiskEngineController);
//# sourceMappingURL=risk-engine.controller.js.map