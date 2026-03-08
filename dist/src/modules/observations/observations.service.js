"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ObservationsService = class ObservationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, observedBy, tenantId) {
        return this.prisma.observation.create({ data: { ...dto, observedBy, tenantId } });
    }
    async list(assessmentId, tenantId) {
        return this.prisma.observation.findMany({ where: { assessmentId, tenantId } });
    }
    async get(id, tenantId) {
        const obs = await this.prisma.observation.findFirst({ where: { id, tenantId } });
        if (!obs)
            throw new common_1.NotFoundException('Observation not found');
        return obs;
    }
};
exports.ObservationsService = ObservationsService;
exports.ObservationsService = ObservationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ObservationsService);
//# sourceMappingURL=observations.service.js.map