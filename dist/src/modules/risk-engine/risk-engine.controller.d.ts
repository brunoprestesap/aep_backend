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
            name: string;
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            assessmentId: string;
            activityId: string | null;
            catalogId: string | null;
            description: string | null;
            category: import(".prisma/client").$Enums.HazardCategory;
            exposureDescription: string | null;
            exposedWorkerCount: number | null;
            existingControls: string | null;
        };
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        severity: import(".prisma/client").$Enums.RiskSeverity;
        probability: import(".prisma/client").$Enums.RiskProbability;
        riskScore: number;
        riskLevel: import(".prisma/client").$Enums.RiskLevel;
        residualSeverity: import(".prisma/client").$Enums.RiskSeverity | null;
        residualProbability: import(".prisma/client").$Enums.RiskProbability | null;
        residualScore: number | null;
        residualLevel: import(".prisma/client").$Enums.RiskLevel | null;
        justification: string | null;
        assessmentId: string;
        hazardId: string;
    }>;
    listByAssessment(assessmentId: string, user: User, riskLevel?: RiskLevel): Promise<({
        hazard: {
            catalog: {
                name: string;
                id: string;
                tenantId: string | null;
                createdAt: Date;
                description: string | null;
                category: import(".prisma/client").$Enums.HazardCategory;
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
            assessmentId: string;
            activityId: string | null;
            catalogId: string | null;
            description: string | null;
            category: import(".prisma/client").$Enums.HazardCategory;
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
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        severity: import(".prisma/client").$Enums.RiskSeverity;
        probability: import(".prisma/client").$Enums.RiskProbability;
        riskScore: number;
        riskLevel: import(".prisma/client").$Enums.RiskLevel;
        residualSeverity: import(".prisma/client").$Enums.RiskSeverity | null;
        residualProbability: import(".prisma/client").$Enums.RiskProbability | null;
        residualScore: number | null;
        residualLevel: import(".prisma/client").$Enums.RiskLevel | null;
        justification: string | null;
        assessmentId: string;
        hazardId: string;
    })[]>;
    getSummary(assessmentId: string, user: User): Promise<Record<string, number>>;
    get(id: string, user: User): Promise<{
        hazard: {
            activity: {
                name: string;
                id: string;
                tenantId: string;
                createdAt: Date;
                updatedAt: Date;
                assessmentId: string;
                description: string | null;
                jobRoleId: string | null;
                workerCount: number | null;
                workShift: string | null;
            } | null;
            catalog: {
                name: string;
                id: string;
                tenantId: string | null;
                createdAt: Date;
                description: string | null;
                category: import(".prisma/client").$Enums.HazardCategory;
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
            assessmentId: string;
            activityId: string | null;
            catalogId: string | null;
            description: string | null;
            category: import(".prisma/client").$Enums.HazardCategory;
            exposureDescription: string | null;
            exposedWorkerCount: number | null;
            existingControls: string | null;
        };
        actionPlans: {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            assessmentId: string;
            riskAssessmentId: string | null;
            title: string;
            objective: string | null;
        }[];
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        severity: import(".prisma/client").$Enums.RiskSeverity;
        probability: import(".prisma/client").$Enums.RiskProbability;
        riskScore: number;
        riskLevel: import(".prisma/client").$Enums.RiskLevel;
        residualSeverity: import(".prisma/client").$Enums.RiskSeverity | null;
        residualProbability: import(".prisma/client").$Enums.RiskProbability | null;
        residualScore: number | null;
        residualLevel: import(".prisma/client").$Enums.RiskLevel | null;
        justification: string | null;
        assessmentId: string;
        hazardId: string;
    }>;
    update(id: string, dto: UpdateRiskAssessmentDto, user: User): Promise<{
        hazard: {
            name: string;
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            assessmentId: string;
            activityId: string | null;
            catalogId: string | null;
            description: string | null;
            category: import(".prisma/client").$Enums.HazardCategory;
            exposureDescription: string | null;
            exposedWorkerCount: number | null;
            existingControls: string | null;
        };
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        severity: import(".prisma/client").$Enums.RiskSeverity;
        probability: import(".prisma/client").$Enums.RiskProbability;
        riskScore: number;
        riskLevel: import(".prisma/client").$Enums.RiskLevel;
        residualSeverity: import(".prisma/client").$Enums.RiskSeverity | null;
        residualProbability: import(".prisma/client").$Enums.RiskProbability | null;
        residualScore: number | null;
        residualLevel: import(".prisma/client").$Enums.RiskLevel | null;
        justification: string | null;
        assessmentId: string;
        hazardId: string;
    }>;
    updateResidual(id: string, dto: UpdateResidualRiskDto, user: User): Promise<{
        hazard: {
            name: string;
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            assessmentId: string;
            activityId: string | null;
            catalogId: string | null;
            description: string | null;
            category: import(".prisma/client").$Enums.HazardCategory;
            exposureDescription: string | null;
            exposedWorkerCount: number | null;
            existingControls: string | null;
        };
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        severity: import(".prisma/client").$Enums.RiskSeverity;
        probability: import(".prisma/client").$Enums.RiskProbability;
        riskScore: number;
        riskLevel: import(".prisma/client").$Enums.RiskLevel;
        residualSeverity: import(".prisma/client").$Enums.RiskSeverity | null;
        residualProbability: import(".prisma/client").$Enums.RiskProbability | null;
        residualScore: number | null;
        residualLevel: import(".prisma/client").$Enums.RiskLevel | null;
        justification: string | null;
        assessmentId: string;
        hazardId: string;
    }>;
    remove(id: string, user: User): Promise<void>;
}
