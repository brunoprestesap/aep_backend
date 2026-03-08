import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AssessmentsService } from './assessments.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('assessments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('assessments')
export class AssessmentsController {
  constructor(private readonly service: AssessmentsService) {}

  @Post()
  create(@Body() dto: CreateAssessmentDto, @CurrentUser() user: User) {
    return this.service.create(dto, user.tenantId);
  }

  @Get()
  list(@Query('organizationId') orgId: string, @CurrentUser() user: User) {
    return this.service.list(user.tenantId, orgId);
  }

  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.service.get(id, user.tenantId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStatusDto,
    @CurrentUser() user: User,
  ) {
    return this.service.updateStatus(id, dto.status, user.tenantId);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.service.remove(id, user.tenantId);
  }

  @Post(':id/activities')
  addActivity(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateActivityDto,
    @CurrentUser() user: User,
  ) {
    return this.service.addActivity(id, dto, user.tenantId);
  }

  @Get(':id/activities')
  listActivities(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.service.listActivities(id, user.tenantId);
  }
}
