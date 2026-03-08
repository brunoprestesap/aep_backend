"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bull_1 = require("@nestjs/bull");
const configuration_1 = require("./config/configuration");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const organizations_module_1 = require("./modules/organizations/organizations.module");
const assessments_module_1 = require("./modules/assessments/assessments.module");
const observations_module_1 = require("./modules/observations/observations.module");
const interviews_module_1 = require("./modules/interviews/interviews.module");
const surveys_module_1 = require("./modules/surveys/surveys.module");
const hazards_module_1 = require("./modules/hazards/hazards.module");
const risk_engine_module_1 = require("./modules/risk-engine/risk-engine.module");
const action_plans_module_1 = require("./modules/action-plans/action-plans.module");
const reporting_module_1 = require("./modules/reporting/reporting.module");
const files_module_1 = require("./modules/files/files.module");
const audit_module_1 = require("./modules/audit/audit.module");
const tenants_module_1 = require("./modules/tenants/tenants.module");
const users_module_1 = require("./modules/users/users.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
            }),
            bull_1.BullModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    redis: {
                        host: config.get('redis.host'),
                        port: config.get('redis.port'),
                    },
                }),
            }),
            prisma_module_1.PrismaModule,
            tenants_module_1.TenantsModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            organizations_module_1.OrganizationsModule,
            assessments_module_1.AssessmentsModule,
            observations_module_1.ObservationsModule,
            interviews_module_1.InterviewsModule,
            surveys_module_1.SurveysModule,
            hazards_module_1.HazardsModule,
            risk_engine_module_1.RiskEngineModule,
            action_plans_module_1.ActionPlansModule,
            reporting_module_1.ReportingModule,
            files_module_1.FilesModule,
            audit_module_1.AuditModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map