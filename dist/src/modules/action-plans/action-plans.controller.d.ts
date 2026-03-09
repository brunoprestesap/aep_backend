import { ActionPlansService, CreateActionPlanDto, UpdateActionPlanDto, CreateActionItemDto, UpdateActionItemDto } from './action-plans.service';
import { ActionItemStatus, User } from '@prisma/client';
export declare class ActionPlansController {
    private readonly service;
    constructor(service: ActionPlansService);
    createPlan(dto: CreateActionPlanDto, user: User): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        assessmentId: string;
        riskAssessmentId: string | null;
        objective: string | null;
    }>;
    listPlans(assessmentId: string, user: User): Promise<({
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
    getPlan(id: string, user: User): Promise<{
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
    updatePlan(id: string, dto: UpdateActionPlanDto, user: User): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        assessmentId: string;
        riskAssessmentId: string | null;
        objective: string | null;
    }>;
    deletePlan(id: string, user: User): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        assessmentId: string;
        riskAssessmentId: string | null;
        objective: string | null;
    }>;
    addItem(id: string, dto: CreateActionItemDto, user: User): Promise<{
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
    updateItem(id: string, itemId: string, dto: UpdateActionItemDto, user: User): Promise<{
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
    updateItemStatus(itemId: string, status: ActionItemStatus, user: User): Promise<{
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
    deleteItem(id: string, itemId: string, user: User): Promise<{
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
