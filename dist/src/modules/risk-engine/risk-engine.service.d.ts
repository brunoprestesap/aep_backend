import { RiskLevel } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateRiskAssessmentDto } from './dto/create-risk-assessment.dto';
import { UpdateRiskAssessmentDto } from './dto/update-risk-assessment.dto';
import { UpdateResidualRiskDto } from './dto/update-residual-risk.dto';
export declare class RiskEngineService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditService);
    classify(dto: CreateRiskAssessmentDto, tenantId: string, userId: string, userName: string): Promise<{
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
    listByAssessment(assessmentId: string, tenantId: string, riskLevel?: RiskLevel): Promise<({
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
    get(id: string, tenantId: string): Promise<{
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
    update(id: string, dto: UpdateRiskAssessmentDto, tenantId: string, userId: string, userName: string): Promise<{
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
    updateResidualRisk(id: string, dto: UpdateResidualRiskDto, tenantId: string, userId: string, userName: string): Promise<{
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
    remove(id: string, tenantId: string, userId: string, userName: string): Promise<void>;
    getSummaryByAssessment(assessmentId: string, tenantId: string): Promise<Record<string, number>>;
}
