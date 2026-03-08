import { HazardCategory, User } from '@prisma/client';
import { HazardsService } from './hazards.service';
import { CreateHazardDto } from './dto/create-hazard.dto';
import { UpdateHazardDto } from './dto/update-hazard.dto';
import { CreateCatalogEntryDto } from './dto/create-catalog-entry.dto';
export declare class HazardsController {
    private readonly service;
    constructor(service: HazardsService);
    listCatalog(user: User, category?: HazardCategory): Promise<{
        name: string;
        id: string;
        tenantId: string | null;
        createdAt: Date;
        category: import(".prisma/client").$Enums.HazardCategory;
        description: string | null;
        possibleConsequences: string | null;
        suggestedControls: string | null;
        isGlobal: boolean;
    }[]>;
    createCatalogEntry(dto: CreateCatalogEntryDto, user: User): Promise<{
        name: string;
        id: string;
        tenantId: string | null;
        createdAt: Date;
        category: import(".prisma/client").$Enums.HazardCategory;
        description: string | null;
        possibleConsequences: string | null;
        suggestedControls: string | null;
        isGlobal: boolean;
    }>;
    create(dto: CreateHazardDto, user: User): Promise<{
        name: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        category: import(".prisma/client").$Enums.HazardCategory;
        description: string | null;
        exposureDescription: string | null;
        exposedWorkerCount: number | null;
        existingControls: string | null;
        assessmentId: string;
        activityId: string | null;
        catalogId: string | null;
    }>;
    list(assessmentId: string, user: User, category?: HazardCategory): Promise<({
        activity: {
            name: string;
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            assessmentId: string;
            jobRoleId: string | null;
            workerCount: number | null;
            workShift: string | null;
        } | null;
        catalog: {
            name: string;
            id: string;
            tenantId: string | null;
            createdAt: Date;
            category: import(".prisma/client").$Enums.HazardCategory;
            description: string | null;
            possibleConsequences: string | null;
            suggestedControls: string | null;
            isGlobal: boolean;
        } | null;
    } & {
        name: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        category: import(".prisma/client").$Enums.HazardCategory;
        description: string | null;
        exposureDescription: string | null;
        exposedWorkerCount: number | null;
        existingControls: string | null;
        assessmentId: string;
        activityId: string | null;
        catalogId: string | null;
    })[]>;
    get(id: string, user: User): Promise<{
        activity: {
            name: string;
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            assessmentId: string;
            jobRoleId: string | null;
            workerCount: number | null;
            workShift: string | null;
        } | null;
        catalog: {
            name: string;
            id: string;
            tenantId: string | null;
            createdAt: Date;
            category: import(".prisma/client").$Enums.HazardCategory;
            description: string | null;
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
        name: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        category: import(".prisma/client").$Enums.HazardCategory;
        description: string | null;
        exposureDescription: string | null;
        exposedWorkerCount: number | null;
        existingControls: string | null;
        assessmentId: string;
        activityId: string | null;
        catalogId: string | null;
    }>;
    update(id: string, dto: UpdateHazardDto, user: User): Promise<{
        name: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        category: import(".prisma/client").$Enums.HazardCategory;
        description: string | null;
        exposureDescription: string | null;
        exposedWorkerCount: number | null;
        existingControls: string | null;
        assessmentId: string;
        activityId: string | null;
        catalogId: string | null;
    }>;
    remove(id: string, user: User): Promise<void>;
}
