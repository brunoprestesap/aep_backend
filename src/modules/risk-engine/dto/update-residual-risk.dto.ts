import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RiskSeverity, RiskProbability } from '@prisma/client';

export class UpdateResidualRiskDto {
  @ApiProperty({ enum: RiskSeverity })
  @IsEnum(RiskSeverity)
  residualSeverity: RiskSeverity;

  @ApiProperty({ enum: RiskProbability })
  @IsEnum(RiskProbability)
  residualProbability: RiskProbability;
}
