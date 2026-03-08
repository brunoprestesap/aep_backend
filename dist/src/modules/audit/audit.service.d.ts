import { PrismaService } from '../../prisma/prisma.service';
export interface AuditLogEntry {
    tenantId: string;
    userId?: string;
    userName?: string;
    action: string;
    resourceType: string;
    resourceId?: string;
    metadata?: object;
    ipAddress?: string;
}
export declare class AuditService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    log(entry: AuditLogEntry): Promise<void>;
    list(tenantId: string, filters?: {
        resourceType?: string;
        resourceId?: string;
        userId?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        action: string;
        userName: string | null;
        resourceType: string;
        resourceId: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        ipAddress: string | null;
        userId: string | null;
    }[]>;
}
