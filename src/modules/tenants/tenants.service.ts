import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTenantDto) {
    const exists = await this.prisma.tenant.findUnique({ where: { slug: dto.slug } });
    if (exists) throw new ConflictException('Slug already in use');

    return this.prisma.tenant.create({
      data: { name: dto.name, slug: dto.slug, plan: dto.plan ?? 'free' },
      select: { id: true, name: true, slug: true, plan: true, createdAt: true },
    });
  }

  async findBySlug(slug: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug, isActive: true },
      select: { id: true, name: true, slug: true, plan: true },
    });
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant;
  }

  async findById(id: string) {
    const tenant = await this.prisma.tenant.findFirst({
      where: { id, isActive: true },
      select: { id: true, name: true, slug: true, plan: true, createdAt: true },
    });
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant;
  }

  async findAll() {
    return this.prisma.tenant.findMany({
      select: { id: true, name: true, slug: true, plan: true, isActive: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, dto: UpdateTenantDto) {
    await this.findById(id);
    return this.prisma.tenant.update({
      where: { id },
      data: dto,
      select: { id: true, name: true, slug: true, plan: true, updatedAt: true },
    });
  }

  async setActive(id: string, isActive: boolean) {
    const tenant = await this.prisma.tenant.findFirst({ where: { id } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    return this.prisma.tenant.update({
      where: { id },
      data: { isActive },
      select: { id: true, name: true, slug: true, isActive: true },
    });
  }
}
