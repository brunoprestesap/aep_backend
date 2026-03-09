import { PrismaService } from '../../prisma/prisma.service';
export declare class DashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getStats(tenantId: string): Promise<{
        organizationsCount: number;
        activeAssessmentsCount: number;
        criticalRisksCount: number;
        pendingActionsCount: number;
        recentAssessments: {
            status: import(".prisma/client").$Enums.AssessmentStatus;
            id: string;
            title: string;
            createdAt: Date;
            updatedAt: Date;
            organization: {
                id: string;
                name: string;
            };
        }[];
        upcomingDeadlines: {
            status: import(".prisma/client").$Enums.ActionItemStatus;
            id: string;
            action: string;
            responsibleName: string;
            dueDate: Date;
            actionPlan: {
                assessment: {
                    id: string;
                    title: string;
                };
                id: string;
                title: string;
            };
        }[];
    }>;
}
