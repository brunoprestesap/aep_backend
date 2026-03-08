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
exports.OrganizationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let OrganizationsService = class OrganizationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createOrganization(dto, tenantId) {
        return this.prisma.organization.create({ data: { ...dto, tenantId } });
    }
    async listOrganizations(tenantId) {
        return this.prisma.organization.findMany({ where: { tenantId, deletedAt: null } });
    }
    async getOrganization(id, tenantId) {
        const org = await this.prisma.organization.findFirst({
            where: { id, tenantId, deletedAt: null },
            include: { units: true },
        });
        if (!org)
            throw new common_1.NotFoundException('Organization not found');
        return org;
    }
    async updateOrganization(id, dto, tenantId) {
        await this.getOrganization(id, tenantId);
        return this.prisma.organization.update({ where: { id }, data: dto });
    }
    async removeOrganization(id, tenantId) {
        await this.getOrganization(id, tenantId);
        return this.prisma.organization.update({ where: { id }, data: { deletedAt: new Date() } });
    }
    async createUnit(organizationId, dto, tenantId) {
        await this.getOrganization(organizationId, tenantId);
        return this.prisma.unit.create({ data: { ...dto, organizationId, tenantId } });
    }
    async listUnits(organizationId, tenantId) {
        return this.prisma.unit.findMany({ where: { organizationId, tenantId, deletedAt: null } });
    }
    async listDepartments(unitId, tenantId) {
        return this.prisma.department.findMany({ where: { unitId, tenantId, deletedAt: null } });
    }
    async createDepartment(unitId, dto, tenantId) {
        const unit = await this.prisma.unit.findFirst({ where: { id: unitId, tenantId, deletedAt: null } });
        if (!unit)
            throw new common_1.NotFoundException('Unit not found');
        return this.prisma.department.create({ data: { ...dto, unitId, tenantId } });
    }
    async listJobRoles(departmentId, tenantId) {
        return this.prisma.jobRole.findMany({ where: { departmentId, tenantId, deletedAt: null } });
    }
    async createJobRole(departmentId, dto, tenantId) {
        const dept = await this.prisma.department.findFirst({ where: { id: departmentId, tenantId, deletedAt: null } });
        if (!dept)
            throw new common_1.NotFoundException('Department not found');
        return this.prisma.jobRole.create({ data: { ...dto, departmentId, tenantId } });
    }
    async createWorker(jobRoleId, dto, tenantId) {
        const role = await this.prisma.jobRole.findFirst({ where: { id: jobRoleId, tenantId, deletedAt: null } });
        if (!role)
            throw new common_1.NotFoundException('Job role not found');
        return this.prisma.worker.create({ data: { ...dto, jobRoleId, tenantId } });
    }
    async listWorkers(jobRoleId, tenantId) {
        return this.prisma.worker.findMany({ where: { jobRoleId, tenantId, deletedAt: null } });
    }
};
exports.OrganizationsService = OrganizationsService;
exports.OrganizationsService = OrganizationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrganizationsService);
//# sourceMappingURL=organizations.service.js.map