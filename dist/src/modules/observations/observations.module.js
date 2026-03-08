"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservationsModule = void 0;
const common_1 = require("@nestjs/common");
const observations_controller_1 = require("./observations.controller");
const observations_service_1 = require("./observations.service");
let ObservationsModule = class ObservationsModule {
};
exports.ObservationsModule = ObservationsModule;
exports.ObservationsModule = ObservationsModule = __decorate([
    (0, common_1.Module)({
        controllers: [observations_controller_1.ObservationsController],
        providers: [observations_service_1.ObservationsService],
        exports: [observations_service_1.ObservationsService],
    })
], ObservationsModule);
//# sourceMappingURL=observations.module.js.map