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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../../prisma/prisma.service");
const USER_SELECT = {
    id: true,
    name: true,
    email: true,
    role: true,
    isActive: true,
    lastLoginAt: true,
    createdAt: true,
    updatedAt: true,
};
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, tenantId) {
        const exists = await this.prisma.user.findFirst({
            where: { email: dto.email, tenantId },
        });
        if (exists)
            throw new common_1.ConflictException('Email already registered in this tenant');
        const passwordHash = await bcrypt.hash(dto.password, 12);
        return this.prisma.user.create({
            data: { name: dto.name, email: dto.email, role: dto.role, tenantId, passwordHash },
            select: USER_SELECT,
        });
    }
    async findAll(tenantId) {
        return this.prisma.user.findMany({
            where: { tenantId, deletedAt: null },
            select: USER_SELECT,
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, tenantId) {
        const user = await this.prisma.user.findFirst({
            where: { id, tenantId, deletedAt: null },
            select: USER_SELECT,
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async update(id, dto, tenantId) {
        await this.findOne(id, tenantId);
        if (dto.email) {
            const conflict = await this.prisma.user.findFirst({
                where: { email: dto.email, tenantId, id: { not: id } },
            });
            if (conflict)
                throw new common_1.ConflictException('Email already in use');
        }
        return this.prisma.user.update({
            where: { id },
            data: dto,
            select: USER_SELECT,
        });
    }
    async updateRole(id, dto, tenantId) {
        await this.findOne(id, tenantId);
        return this.prisma.user.update({
            where: { id },
            data: { role: dto.role },
            select: USER_SELECT,
        });
    }
    async activate(id, tenantId) {
        await this.findOne(id, tenantId);
        return this.prisma.user.update({
            where: { id },
            data: { isActive: true },
            select: USER_SELECT,
        });
    }
    async deactivate(id, tenantId) {
        await this.findOne(id, tenantId);
        return this.prisma.user.update({
            where: { id },
            data: { isActive: false },
            select: USER_SELECT,
        });
    }
    async resetPassword(id, dto, tenantId) {
        await this.findOne(id, tenantId);
        const passwordHash = await bcrypt.hash(dto.newPassword, 12);
        await this.prisma.user.update({
            where: { id },
            data: { passwordHash },
        });
        return { message: 'Password reset successfully' };
    }
    async remove(id, tenantId) {
        await this.findOne(id, tenantId);
        await this.prisma.user.update({
            where: { id },
            data: { deletedAt: new Date(), isActive: false },
        });
        return { message: 'User deleted successfully' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map