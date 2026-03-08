import { HazardCategory } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateHazardDto } from './dto/create-hazard.dto';
import { UpdateHazardDto } from './dto/update-hazard.dto';
import { CreateCatalogEntryDto } from './dto/create-catalog-entry.dto';
export declare class HazardsService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditService);
    create(dto: CreateHazardDto, tenantId: string, userId: string, userName: string): Promise<{
        id: string;
        tenantId: string;
        name: string;
        description: string | null;
        category: import(".prisma/client").$Enums.HazardCategory;
        exposureDescription: string | null;
        exposedWorkerCount: number | null;
        existingControls: string | null;
        createdAt: Date;
        updatedAt: Date;
        assessmentId: string;
        activityId: string | null;
        catalogId: string | null;
    }>;
    list(assessmentId: string, tenantId: string, category?: HazardCategory): Promise<({
        activity: {
            id: string;
            tenantId: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            assessmentId: string;
            jobRoleId: string | null;
            workerCount: number | null;
            workShift: string | null;
        } | null;
        catalog: {
            id: string;
            tenantId: string | null;
            name: string;
            description: string | null;
            category: import(".prisma/client").$Enums.HazardCategory;
            createdAt: Date;
            possibleConsequences: string | null;
            suggestedControls: string | null;
            isGlobal: boolean;
        } | null;
    } & {
        id: string;
        tenantId: string;
        name: string;
        description: string | null;
        category: import(".prisma/client").$Enums.HazardCategory;
        exposureDescription: string | null;
        exposedWorkerCount: number | null;
        existingControls: string | null;
        createdAt: Date;
        updatedAt: Date;
        assessmentId: string;
        activityId: string | null;
        catalogId: string | null;
    })[]>;
    get(id: string, tenantId: string): Promise<{
        activity: {
            id: string;
            tenantId: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            assessmentId: string;
            jobRoleId: string | null;
            workerCount: number | null;
            workShift: string | null;
        } | null;
        catalog: {
            id: string;
            tenantId: string | null;
            name: string;
            description: string | null;
            category: import(".prisma/client").$Enums.HazardCategory;
            createdAt: Date;
            possibleConsequences: string | null;
            suggestedControls: string | null;
            isGlobal: boolean;
        } | null;
        riskAssessments: {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            assessmentId: string;
            hazardId: string;
            severity: import(".prisma/client").$Enums.RiskSeverity;
            probability: import(".prisma/client").$Enums.RiskProbability;
            riskScore: number;
            riskLevel: import(".prisma/client").$Enums.RiskLevel;
            residualSeverity: import(".prisma/client").$Enums.RiskSeverity | null;
            residualProbability: import(".prisma/client").$Enums.RiskProbability | null;
            residualScore: number | null;
            residualLevel: import(".prisma/client").$Enums.RiskLevel | null;
            justification: string | null;
        }[];
    } & {
        id: string;
        tenantId: string;
        name: string;
        description: string | null;
        category: import(".prisma/client").$Enums.HazardCategory;
        exposureDescription: string | null;
        exposedWorkerCount: number | null;
        existingControls: string | null;
        createdAt: Date;
        updatedAt: Date;
        assessmentId: string;
        activityId: string | null;
        catalogId: string | null;
    }>;
    update(id: string, dto: UpdateHazardDto, tenantId: string, userId: string, userName: string): Promise<{
        id: string;
        tenantId: string;
        name: string;
        description: string | null;
        category: import(".prisma/client").$Enums.HazardCategory;
        exposureDescription: string | null;
        exposedWorkerCount: number | null;
        existingControls: string | null;
        createdAt: Date;
        updatedAt: Date;
        assessmentId: string;
        activityId: string | null;
        catalogId: string | null;
    }>;
    remove(id: string, tenantId: string, userId: string, userName: string): Promise<void>;
    listCatalog(tenantId: string, category?: HazardCategory): Promise<{
        id: string;
        tenantId: string | null;
        name: string;
        description: string | null;
        category: import(".prisma/client").$Enums.HazardCategory;
        createdAt: Date;
        possibleConsequences: string | null;
        suggestedControls: string | null;
        isGlobal: boolean;
    }[]>;
    createCatalogEntry(dto: CreateCatalogEntryDto, tenantId: string, userId: string, userName: string): Promise<{
        id: string;
        tenantId: string | null;
        name: string;
        description: string | null;
        category: import(".prisma/client").$Enums.HazardCategory;
        createdAt: Date;
        possibleConsequences: string | null;
        suggestedControls: string | null;
        isGlobal: boolean;
    }>;
}
