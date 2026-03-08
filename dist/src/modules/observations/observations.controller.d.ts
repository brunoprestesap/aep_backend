import { ObservationsService, CreateObservationDto } from './observations.service';
import { User } from '@prisma/client';
export declare class ObservationsController {
    private readonly service;
    constructor(service: ObservationsService);
    create(dto: CreateObservationDto, user: User): Promise<{
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
    list(assessmentId: string, user: User): Promise<{
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
    get(id: string, user: User): Promise<{
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
