"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockshipModule = void 0;
const common_1 = require("@nestjs/common");
const blockship_controller_1 = require("./blockship.controller");
const blockship_service_1 = require("./blockship.service");
const blockship_providers_1 = require("./blockship.providers");
const database_module_1 = require("../../database/database.module");
const blockship_gateway_1 = require("./blockship.gateway");
const session_providers_1 = require("../sessions/session.providers");
const session_service_1 = require("../sessions/session.service");
let BlockshipModule = exports.BlockshipModule = class BlockshipModule {
};
exports.BlockshipModule = BlockshipModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        providers: [
            ...blockship_providers_1.blockshipProviders,
            ...session_providers_1.sessionProviders,
            blockship_service_1.BlockshipService,
            blockship_gateway_1.BlockshipGateway,
            session_service_1.SessionService,
        ],
        controllers: [blockship_controller_1.BlockshipController],
    })
], BlockshipModule);
//# sourceMappingURL=blockship.module.js.map