import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RiskSeverity, RiskProbability } from '@prisma/client';

export class UpdateRiskAssessmentDto {
  @ApiProperty({ enum: RiskSeverity, required: false })
  @IsOptional()
  @IsEnum(RiskSeverity)
  severity?: RiskSeverity;

  @ApiProperty({ enum: RiskProbability, required: false })
  @IsOptional()
  @IsEnum(RiskProbability)
  probability?: RiskProbability;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  justification?: string;
}
