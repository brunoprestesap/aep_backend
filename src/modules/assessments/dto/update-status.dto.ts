import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AssessmentStatus } from '@prisma/client';

export class UpdateStatusDto {
  @ApiProperty({ enum: AssessmentStatus })
  @IsEnum(AssessmentStatus)
  status: AssessmentStatus;
}
