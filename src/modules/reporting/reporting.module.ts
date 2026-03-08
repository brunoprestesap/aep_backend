import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ReportingController } from './reporting.controller';
import { ReportingService, REPORT_QUEUE } from './reporting.service';
import { ReportProcessor } from './processors/report.processor';

@Module({
  imports: [BullModule.registerQueue({ name: REPORT_QUEUE })],
  controllers: [ReportingController],
  providers: [ReportingService, ReportProcessor],
  exports: [ReportingService],
})
export class ReportingModule {}
