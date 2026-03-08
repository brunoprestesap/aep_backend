import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { HazardCategory } from '@prisma/client';

export class CreateCatalogEntryDto {
  @ApiProperty({ enum: HazardCategory })
  @IsEnum(HazardCategory)
  category: HazardCategory;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  possibleConsequences?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  suggestedControls?: string;
}
