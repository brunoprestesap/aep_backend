import { Controller, Get, Post, Body, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReportingService, RequestReportDto } from './reporting.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '@prisma/client';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportingController {
  constructor(private readonly service: ReportingService) {}

  @Post()
  request(@Body() dto: RequestReportDto, @CurrentUser() user: User) {
    return this.service.request(dto, user.id, user.tenantId);
  }

  @Get('assessment/:assessmentId')
  list(
    @Param('assessmentId', ParseUUIDPipe) assessmentId: string,
    @CurrentUser() user: User,
  ) {
    return this.service.list(assessmentId, user.tenantId);
  }

  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.service.get(id, user.tenantId);
  }
}
