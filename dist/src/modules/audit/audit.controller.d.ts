import { AuditService } from './audit.service';
import { User } from '@prisma/client';
export declare class AuditController {
    private readonly service;
    constructor(service: AuditService);
    list(user: User, resourceType?: string, resourceId?: string, userId?: string): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        userId: string | null;
        userName: string | null;
        action: string;
        resourceType: string;
        resourceId: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        ipAddress: string | null;
    }[]>;
}
