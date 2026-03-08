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
exports.HazardsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const hazards_service_1 = require("./hazards.service");
const create_hazard_dto_1 = require("./dto/create-hazard.dto");
const update_hazard_dto_1 = require("./dto/update-hazard.dto");
const create_catalog_entry_dto_1 = require("./dto/create-catalog-entry.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let HazardsController = class HazardsController {
    constructor(service) {
        this.service = service;
    }
    listCatalog(user, category) {
        return this.service.listCatalog(user.tenantId, category);
    }
    createCatalogEntry(dto, user) {
        return this.service.createCatalogEntry(dto, user.tenantId, user.id, user.name);
    }
    create(dto, user) {
        return this.service.create(dto, user.tenantId, user.id, user.name);
    }
    list(assessmentId, user, category) {
        return this.service.list(assessmentId, user.tenantId, category);
    }
    get(id, user) {
        return this.service.get(id, user.tenantId);
    }
    update(id, dto, user) {
        return this.service.update(id, dto, user.tenantId, user.id, user.name);
    }
    remove(id, user) {
        return this.service.remove(id, user.tenantId, user.id, user.name);
    }
};
exports.HazardsController = HazardsController;
__decorate([
    (0, common_1.Get)('catalog'),
    (0, swagger_1.ApiQuery)({ name: 'category', enum: client_1.HazardCategory, required: false }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], HazardsController.prototype, "listCatalog", null);
__decorate([
    (0, common_1.Post)('catalog'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_catalog_entry_dto_1.CreateCatalogEntryDto, Object]),
    __metadata("design:returntype", void 0)
], HazardsController.prototype, "createCatalogEntry", null);
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_hazard_dto_1.CreateHazardDto, Object]),
    __metadata("design:returntype", void 0)
], HazardsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('assessment/:assessmentId'),
    (0, swagger_1.ApiQuery)({ name: 'category', enum: client_1.HazardCategory, required: false }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('assessmentId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], HazardsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], HazardsController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_hazard_dto_1.UpdateHazardDto, Object]),
    __metadata("design:returntype", void 0)
], HazardsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], HazardsController.prototype, "remove", null);
exports.HazardsController = HazardsController = __decorate([
    (0, swagger_1.ApiTags)('hazards'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('hazards'),
    __metadata("design:paramtypes", [hazards_service_1.HazardsService])
], HazardsController);
//# sourceMappingURL=hazards.controller.js.map