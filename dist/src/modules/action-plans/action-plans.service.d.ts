import { ActionItemStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
export interface CreateActionPlanDto {
    assessmentId: string;
    riskAssessmentId?: string;
    title: string;
    objective?: string;
}
export interface UpdateActionPlanDto {
    title?: string;
    objective?: string;
}
export interface CreateActionItemDto {
    action: string;
    responsibleName: string;
    dueDate: Date;
    successIndicators?: string;
}
export interface UpdateActionItemDto {
    action?: string;
    responsibleName?: string;
    dueDate?: Date;
    successIndicators?: string;
    status?: ActionItemStatus;
}
export declare class ActionPlansService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createPlan(dto: CreateActionPlanDto, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        assessmentId: string;
        riskAssessmentId: string | null;
        objective: string | null;
    }>;
    listPlans(assessmentId: string, tenantId: string): Promise<({
        riskAssessment: ({
            hazard: {
                id: string;
                name: string;
                category: import(".prisma/client").$Enums.HazardCategory;
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
        }) | null;
        items: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            status: import(".prisma/client").$Enums.ActionItemStatus;
            completedAt: Date | null;
            action: string;
            actionPlanId: string;
            responsibleName: string;
            dueDate: Date;
            successIndicators: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        assessmentId: string;
        riskAssessmentId: string | null;
        objective: string | null;
    })[]>;
    getPlan(id: string, tenantId: string): Promise<{
        riskAssessment: ({
            hazard: {
                id: string;
                name: string;
                category: import(".prisma/client").$Enums.HazardCategory;
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
        }) | null;
        items: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            status: import(".prisma/client").$Enums.ActionItemStatus;
            completedAt: Date | null;
            action: string;
            actionPlanId: string;
            responsibleName: string;
            dueDate: Date;
            successIndicators: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        assessmentId: string;
        riskAssessmentId: string | null;
        objective: string | null;
    }>;
    updatePlan(id: string, dto: UpdateActionPlanDto, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        assessmentId: string;
        riskAssessmentId: string | null;
        objective: string | null;
    }>;
    deletePlan(id: string, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        assessmentId: string;
        riskAssessmentId: string | null;
        objective: string | null;
    }>;
    addItem(planId: string, dto: CreateActionItemDto, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        status: import(".prisma/client").$Enums.ActionItemStatus;
        completedAt: Date | null;
        action: string;
        actionPlanId: string;
        responsibleName: string;
        dueDate: Date;
        successIndicators: string | null;
    }>;
    updateItem(planId: string, itemId: string, dto: UpdateActionItemDto, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        status: import(".prisma/client").$Enums.ActionItemStatus;
        completedAt: Date | null;
        action: string;
        actionPlanId: string;
        responsibleName: string;
        dueDate: Date;
        successIndicators: string | null;
    }>;
    updateItemStatus(itemId: string, status: ActionItemStatus, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        status: import(".prisma/client").$Enums.ActionItemStatus;
        completedAt: Date | null;
        action: string;
        actionPlanId: string;
        responsibleName: string;
        dueDate: Date;
        successIndicators: string | null;
    }>;
    deleteItem(planId: string, itemId: string, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        status: import(".prisma/client").$Enums.ActionItemStatus;
        completedAt: Date | null;
        action: string;
        actionPlanId: string;
        responsibleName: string;
        dueDate: Date;
        successIndicators: string | null;
    }>;
}
