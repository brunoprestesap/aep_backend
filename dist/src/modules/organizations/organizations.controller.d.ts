import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { CreateUnitDto } from './dto/create-unit.dto';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { CreateJobRoleDto } from './dto/create-job-role.dto';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { User } from '@prisma/client';
export declare class OrganizationsController {
    private readonly service;
    constructor(service: OrganizationsService);
    create(dto: CreateOrganizationDto, user: User): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        deletedAt: Date | null;
        cnpj: string | null;
        industry: string | null;
        address: string | null;
        employeeCount: number | null;
    }>;
    list(user: User): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        deletedAt: Date | null;
        cnpj: string | null;
        industry: string | null;
        address: string | null;
        employeeCount: number | null;
    }[]>;
    get(id: string, user: User): Promise<{
        units: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            deletedAt: Date | null;
            address: string | null;
            organizationId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        deletedAt: Date | null;
        cnpj: string | null;
        industry: string | null;
        address: string | null;
        employeeCount: number | null;
    }>;
    update(id: string, dto: Partial<CreateOrganizationDto>, user: User): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        deletedAt: Date | null;
        cnpj: string | null;
        industry: string | null;
        address: string | null;
        employeeCount: number | null;
    }>;
    remove(id: string, user: User): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        deletedAt: Date | null;
        cnpj: string | null;
        industry: string | null;
        address: string | null;
        employeeCount: number | null;
    }>;
    createUnit(id: string, dto: CreateUnitDto, user: User): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        deletedAt: Date | null;
        address: string | null;
        organizationId: string;
    }>;
    listUnits(id: string, user: User): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        deletedAt: Date | null;
        address: string | null;
        organizationId: string;
    }[]>;
    listDepartments(unitId: string, user: User): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        deletedAt: Date | null;
        description: string | null;
        unitId: string;
    }[]>;
    createDepartment(unitId: string, dto: CreateDepartmentDto, user: User): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        deletedAt: Date | null;
        description: string | null;
        unitId: string;
    }>;
    listJobRoles(deptId: string, user: User): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        deletedAt: Date | null;
        description: string | null;
        departmentId: string;
        workerCount: number;
    }[]>;
    createJobRole(deptId: string, dto: CreateJobRoleDto, user: User): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        deletedAt: Date | null;
        description: string | null;
        departmentId: string;
        workerCount: number;
    }>;
    listWorkers(roleId: string, user: User): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        email: string | null;
        deletedAt: Date | null;
        registration: string | null;
        jobRoleId: string;
    }[]>;
    createWorker(roleId: string, dto: CreateWorkerDto, user: User): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        email: string | null;
        deletedAt: Date | null;
        registration: string | null;
        jobRoleId: string;
    }>;
}
