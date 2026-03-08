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
        tenantId: string;
        title: string;
        objective: string | null;
        createdAt: Date;
        updatedAt: Date;
        assessmentId: string;
        riskAssessmentId: string | null;
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
        }) | null;
        items: {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            actionPlanId: string;
            action: string;
            responsibleName: string;
            dueDate: Date;
            status: import(".prisma/client").$Enums.ActionItemStatus;
            successIndicators: string | null;
            completedAt: Date | null;
        }[];
    } & {
        id: string;
        tenantId: string;
        title: string;
        objective: string | null;
        createdAt: Date;
        updatedAt: Date;
        assessmentId: string;
        riskAssessmentId: string | null;
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
        }) | null;
        items: {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            actionPlanId: string;
            action: string;
            responsibleName: string;
            dueDate: Date;
            status: import(".prisma/client").$Enums.ActionItemStatus;
            successIndicators: string | null;
            completedAt: Date | null;
        }[];
    } & {
        id: string;
        tenantId: string;
        title: string;
        objective: string | null;
        createdAt: Date;
        updatedAt: Date;
        assessmentId: string;
        riskAssessmentId: string | null;
    }>;
    updatePlan(id: string, dto: UpdateActionPlanDto, tenantId: string): Promise<{
        id: string;
        tenantId: string;
        title: string;
        objective: string | null;
        createdAt: Date;
        updatedAt: Date;
        assessmentId: string;
        riskAssessmentId: string | null;
    }>;
    deletePlan(id: string, tenantId: string): Promise<{
        id: string;
        tenantId: string;
        title: string;
        objective: string | null;
        createdAt: Date;
        updatedAt: Date;
        assessmentId: string;
        riskAssessmentId: string | null;
    }>;
    addItem(planId: string, dto: CreateActionItemDto, tenantId: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        actionPlanId: string;
        action: string;
        responsibleName: string;
        dueDate: Date;
        status: import(".prisma/client").$Enums.ActionItemStatus;
        successIndicators: string | null;
        completedAt: Date | null;
    }>;
    updateItem(planId: string, itemId: string, dto: UpdateActionItemDto, tenantId: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        actionPlanId: string;
        action: string;
        responsibleName: string;
        dueDate: Date;
        status: import(".prisma/client").$Enums.ActionItemStatus;
        successIndicators: string | null;
        completedAt: Date | null;
    }>;
    updateItemStatus(itemId: string, status: ActionItemStatus, tenantId: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        actionPlanId: string;
        action: string;
        responsibleName: string;
        dueDate: Date;
        status: import(".prisma/client").$Enums.ActionItemStatus;
        successIndicators: string | null;
        completedAt: Date | null;
    }>;
    deleteItem(planId: string, itemId: string, tenantId: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        actionPlanId: string;
        action: string;
        responsibleName: string;
        dueDate: Date;
        status: import(".prisma/client").$Enums.ActionItemStatus;
        successIndicators: string | null;
        completedAt: Date | null;
    }>;
}
