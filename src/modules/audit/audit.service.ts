import { Injectable } from '@nestjs/common';
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

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(entry: AuditLogEntry) {
    await this.prisma.auditLog.create({ data: entry });
  }

  async list(tenantId: string, filters: { resourceType?: string; resourceId?: string; userId?: string } = {}) {
    return this.prisma.auditLog.findMany({
      where: { tenantId, ...filters },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
