import { IsString, IsUUID, IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { HazardCategory } from '@prisma/client';

export class CreateHazardDto {
  @ApiProperty()
  @IsUUID()
  assessmentId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  activityId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  catalogId?: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: HazardCategory })
  @IsEnum(HazardCategory)
  category: HazardCategory;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  exposureDescription?: string;

  @ApiProperty({ required: false, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  exposedWorkerCount?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  existingControls?: string;
}
