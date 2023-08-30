"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelsUsersModule = void 0;
const common_1 = require("@nestjs/common");
const channels_users_controller_1 = require("./channels_users.controller");
const channels_users_service_1 = require("./channels_users.service");
const channels_users_providers_1 = require("./channels_users.providers");
const database_module_1 = require("../../database/database.module");
const channels_users_gateway_1 = require("./channels_users.gateway");
const session_providers_1 = require("../sessions/session.providers");
const session_service_1 = require("../sessions/session.service");
let ChannelsUsersModule = exports.ChannelsUsersModule = class ChannelsUsersModule {
};
exports.ChannelsUsersModule = ChannelsUsersModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        providers: [
            ...channels_users_providers_1.channelsUsersProviders,
            ...session_providers_1.sessionProviders,
            channels_users_service_1.ChannelsUsersService,
            channels_users_gateway_1.ChannelsUsersGateway,
            session_service_1.SessionService,
        ],
        controllers: [channels_users_controller_1.ChannelsUsersController],
    })
], ChannelsUsersModule);
//# sourceMappingURL=channels_users.module.js.map