import { HazardCategory, User } from '@prisma/client';
import { HazardsService } from './hazards.service';
import { CreateHazardDto } from './dto/create-hazard.dto';
import { UpdateHazardDto } from './dto/update-hazard.dto';
import { CreateCatalogEntryDto } from './dto/create-catalog-entry.dto';
export declare class HazardsController {
    private readonly service;
    constructor(service: HazardsService);
    listCatalog(user: User, category?: HazardCategory): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        tenantId: string | null;
        description: string | null;
        category: import(".prisma/client").$Enums.HazardCategory;
        possibleConsequences: string | null;
        suggestedControls: string | null;
        isGlobal: boolean;
    }[]>;
    createCatalogEntry(dto: CreateCatalogEntryDto, user: User): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        tenantId: string | null;
        description: string | null;
        category: import(".prisma/client").$Enums.HazardCategory;
        possibleConsequences: string | null;
        suggestedControls: string | null;
        isGlobal: boolean;
    }>;
    create(dto: CreateHazardDto, user: User): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
        category: import(".prisma/client").$Enums.HazardCategory;
        assessmentId: string;
        activityId: string | null;
        catalogId: string | null;
        exposureDescription: string | null;
        exposedWorkerCount: number | null;
        existingControls: string | null;
    }>;
    list(assessmentId: string, user: User, category?: HazardCategory): Promise<({
        activity: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            description: string | null;
            workerCount: number | null;
            jobRoleId: string | null;
            workShift: string | null;
            assessmentId: string;
        } | null;
        catalog: {
            id: string;
            name: string;
            createdAt: Date;
            tenantId: string | null;
            description: string | null;
            category: import(".prisma/client").$Enums.HazardCategory;
            possibleConsequences: string | null;
            suggestedControls: string | null;
            isGlobal: boolean;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
        category: import(".prisma/client").$Enums.HazardCategory;
        assessmentId: string;
        activityId: string | null;
        catalogId: string | null;
        exposureDescription: string | null;
        exposedWorkerCount: number | null;
        existingControls: string | null;
    })[]>;
    get(id: string, user: User): Promise<{
        activity: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            description: string | null;
            workerCount: number | null;
            jobRoleId: string | null;
            workShift: string | null;
            assessmentId: string;
        } | null;
        riskAssessments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
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
        catalog: {
            id: string;
            name: string;
            createdAt: Date;
            tenantId: string | null;
            description: string | null;
            category: import(".prisma/client").$Enums.HazardCategory;
            possibleConsequences: string | null;
            suggestedControls: string | null;
            isGlobal: boolean;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
        category: import(".prisma/client").$Enums.HazardCategory;
        assessmentId: string;
        activityId: string | null;
        catalogId: string | null;
        exposureDescription: string | null;
        exposedWorkerCount: number | null;
        existingControls: string | null;
    }>;
    update(id: string, dto: UpdateHazardDto, user: User): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
        category: import(".prisma/client").$Enums.HazardCategory;
        assessmentId: string;
        activityId: string | null;
        catalogId: string | null;
        exposureDescription: string | null;
        exposedWorkerCount: number | null;
        existingControls: string | null;
    }>;
    remove(id: string, user: User): Promise<void>;
}
