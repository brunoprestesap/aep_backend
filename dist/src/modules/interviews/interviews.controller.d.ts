import { InterviewsService, CreateInterviewDto } from './interviews.service';
import { User } from '@prisma/client';
export declare class InterviewsController {
    private readonly service;
    constructor(service: InterviewsService);
    create(dto: CreateInterviewDto, user: User): Promise<{
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
    list(assessmentId: string, user: User): Promise<{
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
    get(id: string, user: User): Promise<{
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
