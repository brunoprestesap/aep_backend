import { Controller, Get, Post, Body, Param, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SurveysService, CreateSurveyDto } from './surveys.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '@prisma/client';

@ApiTags('surveys')
@Controller('surveys')
export class SurveysController {
  constructor(private readonly service: SurveysService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateSurveyDto, @CurrentUser() user: User) {
    return this.service.create(dto, user.tenantId);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'assessmentId', required: false })
  list(@Query('assessmentId') assessmentId: string | undefined, @CurrentUser() user: User) {
    return this.service.list(user.tenantId, assessmentId);
  }

  // Must be declared before :id to avoid NestJS treating "public" as an id
  @Get('public/:token')
  getPublic(@Param('token') token: string) {
    return this.service.getByToken(token);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.service.get(id, user.tenantId);
  }

  @Get(':id/results')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getResults(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.service.getAggregatedResults(id, user.tenantId);
  }

  // Public endpoint – worker responds via access token (no auth required)
  @Post('respond/:token')
  submitResponse(
    @Param('token') token: string,
    @Body('answers') answers: Record<string, number>,
  ) {
    return this.service.submitResponse(token, answers);
  }
}
