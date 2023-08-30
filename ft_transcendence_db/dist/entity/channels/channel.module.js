"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelModule = void 0;
const common_1 = require("@nestjs/common");
const channel_controller_1 = require("./channel.controller");
const channel_service_1 = require("./channel.service");
const channel_providers_1 = require("./channel.providers");
const database_module_1 = require("../../database/database.module");
const channel_gateway_1 = require("./channel.gateway");
const channels_users_service_1 = require("../channels_users/channels_users.service");
const channels_users_providers_1 = require("../channels_users/channels_users.providers");
const session_providers_1 = require("../sessions/session.providers");
const session_service_1 = require("../sessions/session.service");
let ChannelModule = exports.ChannelModule = class ChannelModule {
};
exports.ChannelModule = ChannelModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        providers: [
            ...channel_providers_1.channelProviders,
            ...channels_users_providers_1.channelsUsersProviders,
            ...session_providers_1.sessionProviders,
            channel_service_1.ChannelService,
            channel_gateway_1.ChannelGateway,
            channels_users_service_1.ChannelsUsersService,
            session_service_1.SessionService,
        ],
        controllers: [channel_controller_1.ChannelController],
    })
], ChannelModule);
//# sourceMappingURL=channel.module.js.map