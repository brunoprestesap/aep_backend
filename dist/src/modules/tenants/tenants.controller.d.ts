import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { User } from '@prisma/client';
export declare class TenantsController {
    private readonly tenantsService;
    constructor(tenantsService: TenantsService);
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
    getCurrent(user: User): Promise<{
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
    updateCurrent(user: User, dto: UpdateTenantDto): Promise<{
        id: string;
        slug: string;
        name: string;
        plan: string;
        updatedAt: Date;
    }>;
    activate(id: string): Promise<{
        id: string;
        slug: string;
        name: string;
        isActive: boolean;
    }>;
    deactivate(id: string): Promise<{
        id: string;
        slug: string;
        name: string;
        isActive: boolean;
    }>;
}
