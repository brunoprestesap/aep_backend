import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto, tenantId: string) {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email, tenantId, isActive: true, deletedAt: null },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = this.jwtService.sign({
      sub: user.id,
      tenantId: user.tenantId,
      role: user.role,
    });

    return { accessToken: token, user: { id: user.id, name: user.name, role: user.role } };
  }

  async createUser(dto: CreateUserDto, tenantId: string) {
    const exists = await this.prisma.user.findFirst({
      where: { email: dto.email, tenantId },
    });

    if (exists) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    return this.prisma.user.create({
      data: { ...dto, tenantId, passwordHash },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
  }

  async getProfile(userId: string, tenantId: string) {
    return this.prisma.user.findFirstOrThrow({
      where: { id: userId, tenantId, deletedAt: null },
      select: { id: true, name: true, email: true, role: true, lastLoginAt: true, createdAt: true },
    });
  }
}
