import { Controller, Get, Post, Body, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ObservationsService, CreateObservationDto } from './observations.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '@prisma/client';

@ApiTags('observations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('observations')
export class ObservationsController {
  constructor(private readonly service: ObservationsService) {}

  @Post()
  create(@Body() dto: CreateObservationDto, @CurrentUser() user: User) {
    return this.service.create(dto, user.id, user.tenantId);
  }

  @Get('assessment/:assessmentId')
  list(@Param('assessmentId', ParseUUIDPipe) assessmentId: string, @CurrentUser() user: User) {
    return this.service.list(assessmentId, user.tenantId);
  }

  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.service.get(id, user.tenantId);
  }
}
