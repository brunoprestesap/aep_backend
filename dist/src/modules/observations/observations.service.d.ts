import { PrismaService } from '../../prisma/prisma.service';
export interface CreateObservationDto {
    assessmentId: string;
    activityId?: string;
    observedAt: Date;
    description: string;
    workConditions?: string;
    workerCountPresent?: number;
    location?: string;
}
export declare class ObservationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateObservationDto, observedBy: string, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string;
        assessmentId: string;
        observedBy: string;
        observedAt: Date;
        workConditions: string | null;
        workerCountPresent: number | null;
        location: string | null;
        activityId: string | null;
    }>;
    list(assessmentId: string, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string;
        assessmentId: string;
        observedBy: string;
        observedAt: Date;
        workConditions: string | null;
        workerCountPresent: number | null;
        location: string | null;
        activityId: string | null;
    }[]>;
    get(id: string, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string;
        assessmentId: string;
        observedBy: string;
        observedAt: Date;
        workConditions: string | null;
        workerCountPresent: number | null;
        location: string | null;
        activityId: string | null;
    }>;
}
