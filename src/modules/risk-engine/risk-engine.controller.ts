import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RiskLevel, User } from '@prisma/client';
import { RiskEngineService } from './risk-engine.service';
import { CreateRiskAssessmentDto } from './dto/create-risk-assessment.dto';
import { UpdateRiskAssessmentDto } from './dto/update-risk-assessment.dto';
import { UpdateResidualRiskDto } from './dto/update-residual-risk.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('risk-assessments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('risk-assessments')
export class RiskEngineController {
  constructor(private readonly service: RiskEngineService) {}

  @Post()
  classify(@Body() dto: CreateRiskAssessmentDto, @CurrentUser() user: User) {
    return this.service.classify(dto, user.tenantId, user.id, user.name);
  }

  @Get('assessment/:assessmentId')
  @ApiQuery({ name: 'riskLevel', enum: RiskLevel, required: false })
  listByAssessment(
    @Param('assessmentId', ParseUUIDPipe) assessmentId: string,
    @CurrentUser() user: User,
    @Query('riskLevel') riskLevel?: RiskLevel,
  ) {
    return this.service.listByAssessment(assessmentId, user.tenantId, riskLevel);
  }

  @Get('assessment/:assessmentId/summary')
  getSummary(
    @Param('assessmentId', ParseUUIDPipe) assessmentId: string,
    @CurrentUser() user: User,
  ) {
    return this.service.getSummaryByAssessment(assessmentId, user.tenantId);
  }

  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.service.get(id, user.tenantId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRiskAssessmentDto,
    @CurrentUser() user: User,
  ) {
    return this.service.update(id, dto, user.tenantId, user.id, user.name);
  }

  @Patch(':id/residual')
  updateResidual(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateResidualRiskDto,
    @CurrentUser() user: User,
  ) {
    return this.service.updateResidualRisk(id, dto, user.tenantId, user.id, user.name);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.service.remove(id, user.tenantId, user.id, user.name);
  }
}
