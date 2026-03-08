import { PrismaService } from '../../prisma/prisma.service';
export interface CreateInterviewDto {
    assessmentId: string;
    intervieweeName: string;
    intervieweeRole?: string;
    conductedAt: Date;
    answers?: Record<string, string>;
    notes?: string;
}
export declare class InterviewsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateInterviewDto, conductedBy: string, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        assessmentId: string;
        intervieweeName: string;
        intervieweeRole: string | null;
        conductedBy: string;
        conductedAt: Date;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        notes: string | null;
    }>;
    list(assessmentId: string, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        assessmentId: string;
        intervieweeName: string;
        intervieweeRole: string | null;
        conductedBy: string;
        conductedAt: Date;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        notes: string | null;
    }[]>;
    get(id: string, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        assessmentId: string;
        intervieweeName: string;
        intervieweeRole: string | null;
        conductedBy: string;
        conductedAt: Date;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        notes: string | null;
    }>;
}
