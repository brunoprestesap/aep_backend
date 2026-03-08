import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
export declare class OrganizationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createOrganization(dto: CreateOrganizationDto, tenantId: string): Promise<{
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
    listOrganizations(tenantId: string): Promise<{
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
    getOrganization(id: string, tenantId: string): Promise<{
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
    updateOrganization(id: string, dto: Partial<CreateOrganizationDto>, tenantId: string): Promise<{
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
    removeOrganization(id: string, tenantId: string): Promise<{
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
    createUnit(organizationId: string, dto: {
        name: string;
        address?: string;
    }, tenantId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        deletedAt: Date | null;
        address: string | null;
        organizationId: string;
    }>;
    listUnits(organizationId: string, tenantId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        deletedAt: Date | null;
        address: string | null;
        organizationId: string;
    }[]>;
    listDepartments(unitId: string, tenantId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        deletedAt: Date | null;
        description: string | null;
        unitId: string;
    }[]>;
    createDepartment(unitId: string, dto: {
        name: string;
        description?: string;
    }, tenantId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        deletedAt: Date | null;
        description: string | null;
        unitId: string;
    }>;
    listJobRoles(departmentId: string, tenantId: string): Promise<{
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
    createJobRole(departmentId: string, dto: {
        name: string;
        description?: string;
        workerCount?: number;
    }, tenantId: string): Promise<{
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
    createWorker(jobRoleId: string, dto: {
        name: string;
        email?: string;
        registration?: string;
    }, tenantId: string): Promise<{
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
    listWorkers(jobRoleId: string, tenantId: string): Promise<{
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
}
