import { SurveysService, CreateSurveyDto } from './surveys.service';
import { User } from '@prisma/client';
export declare class SurveysController {
    private readonly service;
    constructor(service: SurveysService);
    create(dto: CreateSurveyDto, user: User): Promise<{
        assessment: {
            title: string;
        };
        _count: {
            responses: number;
        };
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        isAnonymous: boolean;
        accessToken: string;
        closesAt: Date | null;
        assessmentId: string;
        targetJobRoleId: string | null;
    }>;
    list(assessmentId: string | undefined, user: User): Promise<({
        assessment: {
            title: string;
        };
        _count: {
            responses: number;
        };
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        isAnonymous: boolean;
        accessToken: string;
        closesAt: Date | null;
        assessmentId: string;
        targetJobRoleId: string | null;
    })[]>;
    getPublic(token: string): Promise<{
        id: string;
        title: string;
        description: string | null;
        isAnonymous: boolean;
        closesAt: Date | null;
    }>;
    getOne(id: string, user: User): Promise<{
        assessment: {
            title: string;
        };
        _count: {
            responses: number;
        };
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        isAnonymous: boolean;
        accessToken: string;
        closesAt: Date | null;
        assessmentId: string;
        targetJobRoleId: string | null;
    }>;
    getResults(id: string, user: User): Promise<{
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
    submitResponse(token: string, answers: Record<string, number>): Promise<{
        message: string;
    }>;
}
