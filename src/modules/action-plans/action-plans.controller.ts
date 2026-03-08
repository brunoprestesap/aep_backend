import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  ActionPlansService,
  CreateActionPlanDto,
  UpdateActionPlanDto,
  CreateActionItemDto,
  UpdateActionItemDto,
} from './action-plans.service';
import { ActionItemStatus, User } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('action-plans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('action-plans')
export class ActionPlansController {
  constructor(private readonly service: ActionPlansService) {}

  @Post()
  createPlan(@Body() dto: CreateActionPlanDto, @CurrentUser() user: User) {
    return this.service.createPlan(dto, user.tenantId);
  }

  @Get('assessment/:assessmentId')
  listPlans(
    @Param('assessmentId', ParseUUIDPipe) assessmentId: string,
    @CurrentUser() user: User,
  ) {
    return this.service.listPlans(assessmentId, user.tenantId);
  }

  @Get(':id')
  getPlan(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.service.getPlan(id, user.tenantId);
  }

  @Patch(':id')
  updatePlan(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateActionPlanDto,
    @CurrentUser() user: User,
  ) {
    return this.service.updatePlan(id, dto, user.tenantId);
  }

  @Delete(':id')
  deletePlan(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.service.deletePlan(id, user.tenantId);
  }

  @Post(':id/items')
  addItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateActionItemDto,
    @CurrentUser() user: User,
  ) {
    return this.service.addItem(id, dto, user.tenantId);
  }

  @Patch(':id/items/:itemId')
  updateItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() dto: UpdateActionItemDto,
    @CurrentUser() user: User,
  ) {
    return this.service.updateItem(id, itemId, dto, user.tenantId);
  }

  @Patch('items/:itemId/status')
  updateItemStatus(
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body('status') status: ActionItemStatus,
    @CurrentUser() user: User,
  ) {
    return this.service.updateItemStatus(itemId, status, user.tenantId);
  }

  @Delete(':id/items/:itemId')
  deleteItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @CurrentUser() user: User,
  ) {
    return this.service.deleteItem(id, itemId, user.tenantId);
  }
}
