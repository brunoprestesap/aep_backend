import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateHazardDto } from './create-hazard.dto';

export class UpdateHazardDto extends PartialType(
  OmitType(CreateHazardDto, ['assessmentId'] as const),
) {}
