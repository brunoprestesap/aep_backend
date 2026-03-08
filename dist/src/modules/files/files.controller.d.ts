import { FilesService } from './files.service';
import { FileContext, User } from '@prisma/client';
export declare class FilesController {
    private readonly service;
    constructor(service: FilesService);
    upload(file: Express.Multer.File, referenceId: string, context: FileContext, user: User): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        uploadedBy: string;
        context: import(".prisma/client").$Enums.FileContext;
        originalName: string;
        mimeType: string;
        sizeBytes: number;
        storageKey: string;
        publicUrl: string | null;
        referenceId: string;
    }>;
    list(referenceId: string, user: User): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        uploadedBy: string;
        context: import(".prisma/client").$Enums.FileContext;
        originalName: string;
        mimeType: string;
        sizeBytes: number;
        storageKey: string;
        publicUrl: string | null;
        referenceId: string;
    }[]>;
    getSignedUrl(id: string, user: User): Promise<{
        url: string;
    }>;
}
