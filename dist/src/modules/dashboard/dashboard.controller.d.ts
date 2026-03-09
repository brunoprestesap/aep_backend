import { User } from '@prisma/client';
import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly service;
    constructor(service: DashboardService);
    getStats(user: User): Promise<{
        organizationsCount: number;
        activeAssessmentsCount: number;
        criticalRisksCount: number;
        pendingActionsCount: number;
        recentAssessments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.AssessmentStatus;
            title: string;
            organization: {
                name: string;
                id: string;
            };
        }[];
        upcomingDeadlines: {
            id: string;
            status: import(".prisma/client").$Enums.ActionItemStatus;
            action: string;
            responsibleName: string;
            dueDate: Date;
            actionPlan: {
                id: string;
                assessment: {
                    id: string;
                    title: string;
                };
                title: string;
            };
        }[];
    }>;
}
