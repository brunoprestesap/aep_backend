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
import { HazardCategory, User } from '@prisma/client';
import { HazardsService } from './hazards.service';
import { CreateHazardDto } from './dto/create-hazard.dto';
import { UpdateHazardDto } from './dto/update-hazard.dto';
import { CreateCatalogEntryDto } from './dto/create-catalog-entry.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('hazards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('hazards')
export class HazardsController {
  constructor(private readonly service: HazardsService) {}

  // ── Catalog ────────────────────────────────────────────────────────────────

  @Get('catalog')
  @ApiQuery({ name: 'category', enum: HazardCategory, required: false })
  listCatalog(
    @CurrentUser() user: User,
    @Query('category') category?: HazardCategory,
  ) {
    return this.service.listCatalog(user.tenantId, category);
  }

  @Post('catalog')
  createCatalogEntry(@Body() dto: CreateCatalogEntryDto, @CurrentUser() user: User) {
    return this.service.createCatalogEntry(dto, user.tenantId, user.id, user.name);
  }

  // ── Hazards ────────────────────────────────────────────────────────────────

  @Post()
  create(@Body() dto: CreateHazardDto, @CurrentUser() user: User) {
    return this.service.create(dto, user.tenantId, user.id, user.name);
  }

  @Get('assessment/:assessmentId')
  @ApiQuery({ name: 'category', enum: HazardCategory, required: false })
  list(
    @Param('assessmentId', ParseUUIDPipe) assessmentId: string,
    @CurrentUser() user: User,
    @Query('category') category?: HazardCategory,
  ) {
    return this.service.list(assessmentId, user.tenantId, category);
  }

  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.service.get(id, user.tenantId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateHazardDto,
    @CurrentUser() user: User,
  ) {
    return this.service.update(id, dto, user.tenantId, user.id, user.name);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.service.remove(id, user.tenantId, user.id, user.name);
  }
}
