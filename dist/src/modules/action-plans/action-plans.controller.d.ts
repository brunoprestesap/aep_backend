import { ActionPlansService, CreateActionPlanDto, UpdateActionPlanDto, CreateActionItemDto, UpdateActionItemDto } from './action-plans.service';
import { ActionItemStatus, User } from '@prisma/client';
export declare class ActionPlansController {
    private readonly service;
    constructor(service: ActionPlansService);
    createPlan(dto: CreateActionPlanDto, user: User): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        objective: string | null;
        assessmentId: string;
        riskAssessmentId: string | null;
    }>;
    listPlans(assessmentId: string, user: User): Promise<({
        riskAssessment: ({
            hazard: {
                name: string;
                id: string;
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
        createdAt: Date;
        updatedAt: Date;
        title: string;
        objective: string | null;
        assessmentId: string;
        riskAssessmentId: string | null;
    })[]>;
    getPlan(id: string, user: User): Promise<{
        riskAssessment: ({
            hazard: {
                name: string;
                id: string;
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
        createdAt: Date;
        updatedAt: Date;
        title: string;
        objective: string | null;
        assessmentId: string;
        riskAssessmentId: string | null;
    }>;
    updatePlan(id: string, dto: UpdateActionPlanDto, user: User): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        objective: string | null;
        assessmentId: string;
        riskAssessmentId: string | null;
    }>;
    deletePlan(id: string, user: User): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        objective: string | null;
        assessmentId: string;
        riskAssessmentId: string | null;
    }>;
    addItem(id: string, dto: CreateActionItemDto, user: User): Promise<{
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
    updateItem(id: string, itemId: string, dto: UpdateActionItemDto, user: User): Promise<{
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
    updateItemStatus(itemId: string, status: ActionItemStatus, user: User): Promise<{
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
    deleteItem(id: string, itemId: string, user: User): Promise<{
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
