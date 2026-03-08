import { HazardCategory } from '@prisma/client';
export declare class CreateHazardDto {
    assessmentId: string;
    activityId?: string;
    catalogId?: string;
    name: string;
    description?: string;
    category: HazardCategory;
    exposureDescription?: string;
    exposedWorkerCount?: number;
    existingControls?: string;
}
