import {
  Controller,
  Get,
  Post,
  Param,
  ParseUUIDPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { FileContext, User } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('files')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly service: FilesService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('referenceId') referenceId: string,
    @Body('context') context: FileContext,
    @CurrentUser() user: User,
  ) {
    return this.service.upload(file, referenceId, context, user.id, user.tenantId);
  }

  @Get('reference/:referenceId')
  list(@Param('referenceId', ParseUUIDPipe) referenceId: string, @CurrentUser() user: User) {
    return this.service.list(referenceId, user.tenantId);
  }

  @Get(':id/url')
  getSignedUrl(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.service.getSignedUrl(id, user.tenantId);
  }
}
