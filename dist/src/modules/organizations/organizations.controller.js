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
exports.OrganizationsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const organizations_service_1 = require("./organizations.service");
const create_organization_dto_1 = require("./dto/create-organization.dto");
const create_unit_dto_1 = require("./dto/create-unit.dto");
const create_department_dto_1 = require("./dto/create-department.dto");
const create_job_role_dto_1 = require("./dto/create-job-role.dto");
const create_worker_dto_1 = require("./dto/create-worker.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let OrganizationsController = class OrganizationsController {
    constructor(service) {
        this.service = service;
    }
    create(dto, user) {
        return this.service.createOrganization(dto, user.tenantId);
    }
    list(user) {
        return this.service.listOrganizations(user.tenantId);
    }
    get(id, user) {
        return this.service.getOrganization(id, user.tenantId);
    }
    update(id, dto, user) {
        return this.service.updateOrganization(id, dto, user.tenantId);
    }
    remove(id, user) {
        return this.service.removeOrganization(id, user.tenantId);
    }
    createUnit(id, dto, user) {
        return this.service.createUnit(id, dto, user.tenantId);
    }
    listUnits(id, user) {
        return this.service.listUnits(id, user.tenantId);
    }
    listDepartments(unitId, user) {
        return this.service.listDepartments(unitId, user.tenantId);
    }
    createDepartment(unitId, dto, user) {
        return this.service.createDepartment(unitId, dto, user.tenantId);
    }
    listJobRoles(deptId, user) {
        return this.service.listJobRoles(deptId, user.tenantId);
    }
    createJobRole(deptId, dto, user) {
        return this.service.createJobRole(deptId, dto, user.tenantId);
    }
    listWorkers(roleId, user) {
        return this.service.listWorkers(roleId, user.tenantId);
    }
    createWorker(roleId, dto, user) {
        return this.service.createWorker(roleId, dto, user.tenantId);
    }
};
exports.OrganizationsController = OrganizationsController;
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_organization_dto_1.CreateOrganizationDto, Object]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/units'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_unit_dto_1.CreateUnitDto, Object]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "createUnit", null);
__decorate([
    (0, common_1.Get)(':id/units'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "listUnits", null);
__decorate([
    (0, common_1.Get)('units/:unitId/departments'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('unitId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "listDepartments", null);
__decorate([
    (0, common_1.Post)('units/:unitId/departments'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('unitId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_department_dto_1.CreateDepartmentDto, Object]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "createDepartment", null);
__decorate([
    (0, common_1.Get)('departments/:deptId/job-roles'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('deptId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "listJobRoles", null);
__decorate([
    (0, common_1.Post)('departments/:deptId/job-roles'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('deptId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_job_role_dto_1.CreateJobRoleDto, Object]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "createJobRole", null);
__decorate([
    (0, common_1.Get)('job-roles/:roleId/workers'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('roleId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "listWorkers", null);
__decorate([
    (0, common_1.Post)('job-roles/:roleId/workers'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('roleId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_worker_dto_1.CreateWorkerDto, Object]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "createWorker", null);
exports.OrganizationsController = OrganizationsController = __decorate([
    (0, swagger_1.ApiTags)('organizations'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('organizations'),
    __metadata("design:paramtypes", [organizations_service_1.OrganizationsService])
], OrganizationsController);
//# sourceMappingURL=organizations.controller.js.map