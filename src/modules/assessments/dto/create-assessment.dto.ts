import { IsString, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssessmentDto {
  @ApiProperty()
  @IsUUID()
  organizationId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  scope?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  methodology?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  responsibleId?: string;
}
