"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionModule = void 0;
const common_1 = require("@nestjs/common");
const session_providers_1 = require("./session.providers");
const session_service_1 = require("./session.service");
const database_module_1 = require("../../database/database.module");
const session_gateway_1 = require("./session.gateway");
const session_controller_1 = require("./session.controller");
let SessionModule = exports.SessionModule = class SessionModule {
};
exports.SessionModule = SessionModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        providers: [
            ...session_providers_1.sessionProviders,
            session_service_1.SessionService,
            session_gateway_1.SessionGateway,
        ],
        controllers: [session_controller_1.SessionController],
    })
], SessionModule);
//# sourceMappingURL=session.module.js.map