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
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            assessmentId: string;
            name: string;
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
        severity: import(".prisma/client").$Enums.RiskSeverity;
        probability: import(".prisma/client").$Enums.RiskProbability;
        riskScore: number;
        riskLevel: import(".prisma/client").$Enums.RiskLevel;
        residualSeverity: import(".prisma/client").$Enums.RiskSeverity | null;
        residualProbability: import(".prisma/client").$Enums.RiskProbability | null;
        residualScore: number | null;
        residualLevel: import(".prisma/client").$Enums.RiskLevel | null;
        justification: string | null;
        createdAt: Date;
        updatedAt: Date;
        assessmentId: string;
        hazardId: string;
    }>;
    listByAssessment(assessmentId: string, tenantId: string, riskLevel?: RiskLevel): Promise<({
        hazard: {
            catalog: {
                id: string;
                tenantId: string | null;
                createdAt: Date;
                name: string;
                description: string | null;
                category: import(".prisma/client").$Enums.HazardCategory;
                possibleConsequences: string | null;
                suggestedControls: string | null;
                isGlobal: boolean;
            } | null;
        } & {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            assessmentId: string;
            name: string;
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
        severity: import(".prisma/client").$Enums.RiskSeverity;
        probability: import(".prisma/client").$Enums.RiskProbability;
        riskScore: number;
        riskLevel: import(".prisma/client").$Enums.RiskLevel;
        residualSeverity: import(".prisma/client").$Enums.RiskSeverity | null;
        residualProbability: import(".prisma/client").$Enums.RiskProbability | null;
        residualScore: number | null;
        residualLevel: import(".prisma/client").$Enums.RiskLevel | null;
        justification: string | null;
        createdAt: Date;
        updatedAt: Date;
        assessmentId: string;
        hazardId: string;
    })[]>;
    get(id: string, tenantId: string): Promise<{
        hazard: {
            activity: {
                id: string;
                tenantId: string;
                createdAt: Date;
                updatedAt: Date;
                assessmentId: string;
                name: string;
                description: string | null;
                jobRoleId: string | null;
                workerCount: number | null;
                workShift: string | null;
            } | null;
            catalog: {
                id: string;
                tenantId: string | null;
                createdAt: Date;
                name: string;
                description: string | null;
                category: import(".prisma/client").$Enums.HazardCategory;
                possibleConsequences: string | null;
                suggestedControls: string | null;
                isGlobal: boolean;
            } | null;
        } & {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            assessmentId: string;
            name: string;
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
        severity: import(".prisma/client").$Enums.RiskSeverity;
        probability: import(".prisma/client").$Enums.RiskProbability;
        riskScore: number;
        riskLevel: import(".prisma/client").$Enums.RiskLevel;
        residualSeverity: import(".prisma/client").$Enums.RiskSeverity | null;
        residualProbability: import(".prisma/client").$Enums.RiskProbability | null;
        residualScore: number | null;
        residualLevel: import(".prisma/client").$Enums.RiskLevel | null;
        justification: string | null;
        createdAt: Date;
        updatedAt: Date;
        assessmentId: string;
        hazardId: string;
    }>;
    update(id: string, dto: UpdateRiskAssessmentDto, tenantId: string, userId: string, userName: string): Promise<{
        hazard: {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            assessmentId: string;
            name: string;
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
        severity: import(".prisma/client").$Enums.RiskSeverity;
        probability: import(".prisma/client").$Enums.RiskProbability;
        riskScore: number;
        riskLevel: import(".prisma/client").$Enums.RiskLevel;
        residualSeverity: import(".prisma/client").$Enums.RiskSeverity | null;
        residualProbability: import(".prisma/client").$Enums.RiskProbability | null;
        residualScore: number | null;
        residualLevel: import(".prisma/client").$Enums.RiskLevel | null;
        justification: string | null;
        createdAt: Date;
        updatedAt: Date;
        assessmentId: string;
        hazardId: string;
    }>;
    updateResidualRisk(id: string, dto: UpdateResidualRiskDto, tenantId: string, userId: string, userName: string): Promise<{
        hazard: {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            assessmentId: string;
            name: string;
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
        severity: import(".prisma/client").$Enums.RiskSeverity;
        probability: import(".prisma/client").$Enums.RiskProbability;
        riskScore: number;
        riskLevel: import(".prisma/client").$Enums.RiskLevel;
        residualSeverity: import(".prisma/client").$Enums.RiskSeverity | null;
        residualProbability: import(".prisma/client").$Enums.RiskProbability | null;
        residualScore: number | null;
        residualLevel: import(".prisma/client").$Enums.RiskLevel | null;
        justification: string | null;
        createdAt: Date;
        updatedAt: Date;
        assessmentId: string;
        hazardId: string;
    }>;
    remove(id: string, tenantId: string, userId: string, userName: string): Promise<void>;
    getSummaryByAssessment(assessmentId: string, tenantId: string): Promise<Record<string, number>>;
}
