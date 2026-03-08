import { Queue } from 'bull';
import { ReportType, ReportFormat } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
export interface RequestReportDto {
    assessmentId: string;
    type: ReportType;
    format: ReportFormat;
}
export declare const REPORT_QUEUE = "report-generation";
export declare class ReportingService {
    private readonly prisma;
    private readonly reportQueue;
    constructor(prisma: PrismaService, reportQueue: Queue);
    request(dto: RequestReportDto, requestedBy: string, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        type: import(".prisma/client").$Enums.ReportType;
        format: import(".prisma/client").$Enums.ReportFormat;
        status: import(".prisma/client").$Enums.ReportStatus;
        completedAt: Date | null;
        assessmentId: string;
        requestedBy: string;
        fileKey: string | null;
        fileUrl: string | null;
        errorMessage: string | null;
    }>;
    list(assessmentId: string, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        type: import(".prisma/client").$Enums.ReportType;
        format: import(".prisma/client").$Enums.ReportFormat;
        status: import(".prisma/client").$Enums.ReportStatus;
        completedAt: Date | null;
        assessmentId: string;
        requestedBy: string;
        fileKey: string | null;
        fileUrl: string | null;
        errorMessage: string | null;
    }[]>;
    get(id: string, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        type: import(".prisma/client").$Enums.ReportType;
        format: import(".prisma/client").$Enums.ReportFormat;
        status: import(".prisma/client").$Enums.ReportStatus;
        completedAt: Date | null;
        assessmentId: string;
        requestedBy: string;
        fileKey: string | null;
        fileUrl: string | null;
        errorMessage: string | null;
    }>;
    markCompleted(id: string, fileKey: string, fileUrl: string): Promise<void>;
    markFailed(id: string, errorMessage: string): Promise<void>;
}
