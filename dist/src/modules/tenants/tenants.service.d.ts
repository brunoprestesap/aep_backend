import { PrismaService } from '../../prisma/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
export declare class TenantsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateTenantDto): Promise<{
        id: string;
        slug: string;
        name: string;
        plan: string;
        createdAt: Date;
    }>;
    findBySlug(slug: string): Promise<{
        id: string;
        slug: string;
        name: string;
        plan: string;
    }>;
    findById(id: string): Promise<{
        id: string;
        slug: string;
        name: string;
        plan: string;
        createdAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        slug: string;
        name: string;
        isActive: boolean;
        plan: string;
        createdAt: Date;
    }[]>;
    update(id: string, dto: UpdateTenantDto): Promise<{
        id: string;
        slug: string;
        name: string;
        plan: string;
        updatedAt: Date;
    }>;
    setActive(id: string, isActive: boolean): Promise<{
        id: string;
        slug: string;
        name: string;
        isActive: boolean;
    }>;
}
