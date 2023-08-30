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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelsUsersController = void 0;
const common_1 = require("@nestjs/common");
const channels_users_service_1 = require("./channels_users.service");
const session_service_1 = require("../sessions/session.service");
let ChannelsUsersController = exports.ChannelsUsersController = class ChannelsUsersController {
    constructor(channelsUsersService, sessionService) {
        this.channelsUsersService = channelsUsersService;
        this.sessionService = sessionService;
    }
    async getUserWithPermissions(req, channelId) {
        if (!req.cookies['SESSION_KEY'] || !this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY'])) {
            return (null);
        }
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        const res = await this.channelsUsersService.findRelation(user.id, channelId);
        if (!res || !res[0])
            return (null);
        const userPerms = {
            id: res[0].id,
            isAdmin: res[0].isAdmin,
            isOwner: res[0].isOwner,
            isInvited: res[0].isInvited,
            isBanned: res[0].isBanned,
        };
        return (userPerms);
    }
};
__decorate([
    (0, common_1.Get)('userPerms'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('channelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelsUsersController.prototype, "getUserWithPermissions", null);
exports.ChannelsUsersController = ChannelsUsersController = __decorate([
    (0, common_1.Controller)('channels_users'),
    __metadata("design:paramtypes", [channels_users_service_1.ChannelsUsersService, session_service_1.SessionService])
], ChannelsUsersController);
//# sourceMappingURL=channels_users.controller.js.map