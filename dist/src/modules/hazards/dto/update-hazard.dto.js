"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateHazardDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_hazard_dto_1 = require("./create-hazard.dto");
class UpdateHazardDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_hazard_dto_1.CreateHazardDto, ['assessmentId'])) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateHazardDto = UpdateHazardDto;
//# sourceMappingURL=update-hazard.dto.js.map