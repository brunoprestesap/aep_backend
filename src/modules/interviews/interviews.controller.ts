import { Controller, Get, Post, Body, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InterviewsService, CreateInterviewDto } from './interviews.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '@prisma/client';

@ApiTags('interviews')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('interviews')
export class InterviewsController {
  constructor(private readonly service: InterviewsService) {}

  @Post()
  create(@Body() dto: CreateInterviewDto, @CurrentUser() user: User) {
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
