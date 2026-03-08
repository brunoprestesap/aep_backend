import { ReportingService, RequestReportDto } from './reporting.service';
import { User } from '@prisma/client';
export declare class ReportingController {
    private readonly service;
    constructor(service: ReportingService);
    request(dto: RequestReportDto, user: User): Promise<{
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
    list(assessmentId: string, user: User): Promise<{
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
    get(id: string, user: User): Promise<{
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
}
