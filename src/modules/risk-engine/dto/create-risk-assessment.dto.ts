import { IsUUID, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RiskSeverity, RiskProbability } from '@prisma/client';

export class CreateRiskAssessmentDto {
  @ApiProperty()
  @IsUUID()
  assessmentId: string;

  @ApiProperty()
  @IsUUID()
  hazardId: string;

  @ApiProperty({ enum: RiskSeverity })
  @IsEnum(RiskSeverity)
  severity: RiskSeverity;

  @ApiProperty({ enum: RiskProbability })
  @IsEnum(RiskProbability)
  probability: RiskProbability;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  justification?: string;
}
