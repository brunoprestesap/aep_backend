import { IsString, MinLength, Matches, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTenantDto {
  @ApiProperty({ example: 'Empresa Demo Ltda' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'empresa-demo', description: 'Unique slug (lowercase, hyphens only)' })
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase letters, numbers and hyphens only',
  })
  slug: string;

  @ApiPropertyOptional({ example: 'professional' })
  @IsOptional()
  @IsString()
  plan?: string;
}
