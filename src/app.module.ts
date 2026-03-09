import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import configuration from './config/configuration';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { AssessmentsModule } from './modules/assessments/assessments.module';
import { ObservationsModule } from './modules/observations/observations.module';
import { InterviewsModule } from './modules/interviews/interviews.module';
import { SurveysModule } from './modules/surveys/surveys.module';
import { HazardsModule } from './modules/hazards/hazards.module';
import { RiskEngineModule } from './modules/risk-engine/risk-engine.module';
import { ActionPlansModule } from './modules/action-plans/action-plans.module';
import { ReportingModule } from './modules/reporting/reporting.module';
import { FilesModule } from './modules/files/files.module';
import { AuditModule } from './modules/audit/audit.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { UsersModule } from './modules/users/users.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get('redis.host'),
          port: config.get('redis.port'),
        },
      }),
    }),

    PrismaModule,
    TenantsModule,
    AuthModule,
    UsersModule,
    OrganizationsModule,
    AssessmentsModule,
    ObservationsModule,
    InterviewsModule,
    SurveysModule,
    HazardsModule,
    RiskEngineModule,
    ActionPlansModule,
    ReportingModule,
    FilesModule,
    AuditModule,
    DashboardModule,
  ],
})
export class AppModule {}
