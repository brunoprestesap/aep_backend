import { RiskLevel, User } from '@prisma/client';
import { RiskEngineService } from './risk-engine.service';
import { CreateRiskAssessmentDto } from './dto/create-risk-assessment.dto';
import { UpdateRiskAssessmentDto } from './dto/update-risk-assessment.dto';
import { UpdateResidualRiskDto } from './dto/update-residual-risk.dto';
export declare class RiskEngineController {
    private readonly service;
    constructor(service: RiskEngineService);
    classify(dto: CreateRiskAssessmentDto, user: User): Promise<{
        hazard: {
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
        };
    } & {
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
    }>;
    listByAssessment(assessmentId: string, user: User, riskLevel?: RiskLevel): Promise<({
        hazard: {
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
        };
        actionPlans: {
            id: string;
            title: string;
        }[];
    } & {
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
    })[]>;
    getSummary(assessmentId: string, user: User): Promise<Record<string, number>>;
    get(id: string, user: User): Promise<{
        hazard: {
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
        };
        actionPlans: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            title: string;
            assessmentId: string;
            riskAssessmentId: string | null;
            objective: string | null;
        }[];
    } & {
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
    }>;
    update(id: string, dto: UpdateRiskAssessmentDto, user: User): Promise<{
        hazard: {
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
        };
    } & {
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
    }>;
    updateResidual(id: string, dto: UpdateResidualRiskDto, user: User): Promise<{
        hazard: {
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
        };
    } & {
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
    }>;
    remove(id: string, user: User): Promise<void>;
}
