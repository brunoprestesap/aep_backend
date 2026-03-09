import { PrismaService } from '../../prisma/prisma.service';
export interface CreateSurveyDto {
    assessmentId: string;
    title: string;
    description?: string;
    targetJobRoleId?: string;
    isAnonymous?: boolean;
    closesAt?: Date;
}
export declare class SurveysService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateSurveyDto, tenantId: string): Promise<{
        assessment: {
            title: string;
        };
        _count: {
            responses: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
        title: string;
        assessmentId: string;
        isAnonymous: boolean;
        accessToken: string;
        closesAt: Date | null;
        targetJobRoleId: string | null;
    }>;
    list(tenantId: string, assessmentId?: string): Promise<({
        assessment: {
            title: string;
        };
        _count: {
            responses: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
        title: string;
        assessmentId: string;
        isAnonymous: boolean;
        accessToken: string;
        closesAt: Date | null;
        targetJobRoleId: string | null;
    })[]>;
    get(id: string, tenantId: string): Promise<{
        assessment: {
            title: string;
        };
        _count: {
            responses: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
        title: string;
        assessmentId: string;
        isAnonymous: boolean;
        accessToken: string;
        closesAt: Date | null;
        targetJobRoleId: string | null;
    }>;
    getByToken(accessToken: string): Promise<{
        id: string;
        title: string;
        description: string | null;
        isAnonymous: boolean;
        closesAt: Date | null;
    }>;
    submitResponse(accessToken: string, answers: Record<string, number>): Promise<{
        message: string;
    }>;
    getAggregatedResults(surveyId: string, tenantId: string): Promise<{
        surveyId: string;
        totalResponses: number;
        responseRate: number;
        dimensions: {
            dimension: "workload" | "autonomy" | "leadership_support" | "peer_relationships" | "recognition" | "communication" | "psychological_pressure" | "wellbeing";
            label: string;
            average: number;
            riskLevel: "low" | "attention" | "medium" | "high";
            responseCount: number;
        }[];
    }>;
}
