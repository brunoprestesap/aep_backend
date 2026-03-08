import { ConfigService } from '@nestjs/config';
import { FileContext } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
export declare class FilesService {
    private readonly prisma;
    private readonly config;
    private readonly s3;
    private readonly bucket;
    constructor(prisma: PrismaService, config: ConfigService);
    upload(file: Express.Multer.File, referenceId: string, context: FileContext, uploadedBy: string, tenantId: string): Promise<{
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
    list(referenceId: string, tenantId: string): Promise<{
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
    getSignedUrl(id: string, tenantId: string): Promise<{
        url: string;
    }>;
}
