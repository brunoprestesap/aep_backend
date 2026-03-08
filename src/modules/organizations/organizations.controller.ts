import { Controller, Get, Post, Patch, Delete, Body, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { CreateUnitDto } from './dto/create-unit.dto';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { CreateJobRoleDto } from './dto/create-job-role.dto';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '@prisma/client';

@ApiTags('organizations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly service: OrganizationsService) {}

  @Post()
  create(@Body() dto: CreateOrganizationDto, @CurrentUser() user: User) {
    return this.service.createOrganization(dto, user.tenantId);
  }

  @Get()
  list(@CurrentUser() user: User) {
    return this.service.listOrganizations(user.tenantId);
  }

  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.service.getOrganization(id, user.tenantId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: Partial<CreateOrganizationDto>,
    @CurrentUser() user: User,
  ) {
    return this.service.updateOrganization(id, dto, user.tenantId);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.service.removeOrganization(id, user.tenantId);
  }

  @Post(':id/units')
  createUnit(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateUnitDto,
    @CurrentUser() user: User,
  ) {
    return this.service.createUnit(id, dto, user.tenantId);
  }

  @Get(':id/units')
  listUnits(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.service.listUnits(id, user.tenantId);
  }

  @Get('units/:unitId/departments')
  listDepartments(@Param('unitId', ParseUUIDPipe) unitId: string, @CurrentUser() user: User) {
    return this.service.listDepartments(unitId, user.tenantId);
  }

  @Post('units/:unitId/departments')
  createDepartment(
    @Param('unitId', ParseUUIDPipe) unitId: string,
    @Body() dto: CreateDepartmentDto,
    @CurrentUser() user: User,
  ) {
    return this.service.createDepartment(unitId, dto, user.tenantId);
  }

  @Get('departments/:deptId/job-roles')
  listJobRoles(@Param('deptId', ParseUUIDPipe) deptId: string, @CurrentUser() user: User) {
    return this.service.listJobRoles(deptId, user.tenantId);
  }

  @Post('departments/:deptId/job-roles')
  createJobRole(
    @Param('deptId', ParseUUIDPipe) deptId: string,
    @Body() dto: CreateJobRoleDto,
    @CurrentUser() user: User,
  ) {
    return this.service.createJobRole(deptId, dto, user.tenantId);
  }

  @Get('job-roles/:roleId/workers')
  listWorkers(@Param('roleId', ParseUUIDPipe) roleId: string, @CurrentUser() user: User) {
    return this.service.listWorkers(roleId, user.tenantId);
  }

  @Post('job-roles/:roleId/workers')
  createWorker(
    @Param('roleId', ParseUUIDPipe) roleId: string,
    @Body() dto: CreateWorkerDto,
    @CurrentUser() user: User,
  ) {
    return this.service.createWorker(roleId, dto, user.tenantId);
  }
}
