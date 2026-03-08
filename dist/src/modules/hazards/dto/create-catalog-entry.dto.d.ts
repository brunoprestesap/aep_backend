import { HazardCategory } from '@prisma/client';
export declare class CreateCatalogEntryDto {
    category: HazardCategory;
    name: string;
    description?: string;
    possibleConsequences?: string;
    suggestedControls?: string;
}
