import { Response } from 'express';
import { ReportingService, RequestReportDto } from './reporting.service';
import { User } from '@prisma/client';
export declare class ReportingController {
    private readonly service;
    constructor(service: ReportingService);
    request(dto: RequestReportDto, user: User): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        requestedBy: string;
        type: import(".prisma/client").$Enums.ReportType;
        format: import(".prisma/client").$Enums.ReportFormat;
        status: import(".prisma/client").$Enums.ReportStatus;
        fileKey: string | null;
        fileUrl: string | null;
        errorMessage: string | null;
        completedAt: Date | null;
        assessmentId: string;
    }>;
    list(assessmentId: string, user: User): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        requestedBy: string;
        type: import(".prisma/client").$Enums.ReportType;
        format: import(".prisma/client").$Enums.ReportFormat;
        status: import(".prisma/client").$Enums.ReportStatus;
        fileKey: string | null;
        fileUrl: string | null;
        errorMessage: string | null;
        completedAt: Date | null;
        assessmentId: string;
    }[]>;
    download(id: string, user: User, res: Response): Promise<void>;
    get(id: string, user: User): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        requestedBy: string;
        type: import(".prisma/client").$Enums.ReportType;
        format: import(".prisma/client").$Enums.ReportFormat;
        status: import(".prisma/client").$Enums.ReportStatus;
        fileKey: string | null;
        fileUrl: string | null;
        errorMessage: string | null;
        completedAt: Date | null;
        assessmentId: string;
    }>;
}
