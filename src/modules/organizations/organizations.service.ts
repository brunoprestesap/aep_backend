import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrganization(dto: CreateOrganizationDto, tenantId: string) {
    return this.prisma.organization.create({ data: { ...dto, tenantId } });
  }

  async listOrganizations(tenantId: string) {
    return this.prisma.organization.findMany({ where: { tenantId, deletedAt: null } });
  }

  async getOrganization(id: string, tenantId: string) {
    const org = await this.prisma.organization.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: { units: true },
    });
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async updateOrganization(id: string, dto: Partial<CreateOrganizationDto>, tenantId: string) {
    await this.getOrganization(id, tenantId);
    return this.prisma.organization.update({ where: { id }, data: dto });
  }

  async removeOrganization(id: string, tenantId: string) {
    await this.getOrganization(id, tenantId);
    return this.prisma.organization.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async createUnit(organizationId: string, dto: { name: string; address?: string }, tenantId: string) {
    await this.getOrganization(organizationId, tenantId);
    return this.prisma.unit.create({ data: { ...dto, organizationId, tenantId } });
  }

  async listUnits(organizationId: string, tenantId: string) {
    return this.prisma.unit.findMany({ where: { organizationId, tenantId, deletedAt: null } });
  }

  async listDepartments(unitId: string, tenantId: string) {
    return this.prisma.department.findMany({ where: { unitId, tenantId, deletedAt: null } });
  }

  async createDepartment(unitId: string, dto: { name: string; description?: string }, tenantId: string) {
    const unit = await this.prisma.unit.findFirst({ where: { id: unitId, tenantId, deletedAt: null } });
    if (!unit) throw new NotFoundException('Unit not found');
    return this.prisma.department.create({ data: { ...dto, unitId, tenantId } });
  }

  async listJobRoles(departmentId: string, tenantId: string) {
    return this.prisma.jobRole.findMany({ where: { departmentId, tenantId, deletedAt: null } });
  }

  async createJobRole(departmentId: string, dto: { name: string; description?: string; workerCount?: number }, tenantId: string) {
    const dept = await this.prisma.department.findFirst({ where: { id: departmentId, tenantId, deletedAt: null } });
    if (!dept) throw new NotFoundException('Department not found');
    return this.prisma.jobRole.create({ data: { ...dto, departmentId, tenantId } });
  }

  async createWorker(jobRoleId: string, dto: { name: string; email?: string; registration?: string }, tenantId: string) {
    const role = await this.prisma.jobRole.findFirst({ where: { id: jobRoleId, tenantId, deletedAt: null } });
    if (!role) throw new NotFoundException('Job role not found');
    return this.prisma.worker.create({ data: { ...dto, jobRoleId, tenantId } });
  }

  async listWorkers(jobRoleId: string, tenantId: string) {
    return this.prisma.worker.findMany({ where: { jobRoleId, tenantId, deletedAt: null } });
  }
}
