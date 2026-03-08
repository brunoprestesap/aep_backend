"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let TenantsService = class TenantsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const exists = await this.prisma.tenant.findUnique({ where: { slug: dto.slug } });
        if (exists)
            throw new common_1.ConflictException('Slug already in use');
        return this.prisma.tenant.create({
            data: { name: dto.name, slug: dto.slug, plan: dto.plan ?? 'free' },
            select: { id: true, name: true, slug: true, plan: true, createdAt: true },
        });
    }
    async findBySlug(slug) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { slug, isActive: true },
            select: { id: true, name: true, slug: true, plan: true },
        });
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        return tenant;
    }
    async findById(id) {
        const tenant = await this.prisma.tenant.findFirst({
            where: { id, isActive: true },
            select: { id: true, name: true, slug: true, plan: true, createdAt: true },
        });
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        return tenant;
    }
    async findAll() {
        return this.prisma.tenant.findMany({
            select: { id: true, name: true, slug: true, plan: true, isActive: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async update(id, dto) {
        await this.findById(id);
        return this.prisma.tenant.update({
            where: { id },
            data: dto,
            select: { id: true, name: true, slug: true, plan: true, updatedAt: true },
        });
    }
    async setActive(id, isActive) {
        const tenant = await this.prisma.tenant.findFirst({ where: { id } });
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        return this.prisma.tenant.update({
            where: { id },
            data: { isActive },
            select: { id: true, name: true, slug: true, isActive: true },
        });
    }
};
exports.TenantsService = TenantsService;
exports.TenantsService = TenantsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TenantsService);
//# sourceMappingURL=tenants.service.js.map