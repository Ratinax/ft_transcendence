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
exports.ChannelController = void 0;
const common_1 = require("@nestjs/common");
const channel_service_1 = require("./channel.service");
const channels_users_service_1 = require("../channels_users/channels_users.service");
const session_service_1 = require("../sessions/session.service");
let ChannelController = exports.ChannelController = class ChannelController {
    constructor(channelService, channelsUsersService, sessionService) {
        this.channelService = channelService;
        this.channelsUsersService = channelsUsersService;
        this.sessionService = sessionService;
    }
    async find(req) {
        if (!req.cookies['SESSION_KEY'] || !this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY'])) {
            return (null);
        }
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        const channels = await this.channelsUsersService.findChannelsOfUsers(user.id);
        return (channels);
    }
    async setPassword(body, req) {
        if (!req.cookies['SESSION_KEY'] || !this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY'])) {
            return (null);
        }
        return (await this.channelService.setPassword(body.channel, body.password));
    }
    async removePassword(body, req) {
        if (!req.cookies['SESSION_KEY'] || !this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY'])) {
            return (null);
        }
        return (await this.channelService.removePassword(body.channel));
    }
    async changePassword(body, req) {
        if (!req.cookies['SESSION_KEY'] || !this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY'])) {
            return (null);
        }
        return (await this.channelService.changePassword(body.channel, body.password));
    }
    async toPublic(body, req) {
        if (!req.cookies['SESSION_KEY'] || !this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY'])) {
            return (null);
        }
        return (await this.channelService.toPublic(body.channel));
    }
    async toPrivate(body, req) {
        if (!req.cookies['SESSION_KEY'] || !this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY'])) {
            return (null);
        }
        return (await this.channelService.toPrivate(body.channel));
    }
};
__decorate([
    (0, common_1.Get)(''),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "find", null);
__decorate([
    (0, common_1.Post)('setPassword'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "setPassword", null);
__decorate([
    (0, common_1.Post)('removePassword'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "removePassword", null);
__decorate([
    (0, common_1.Post)('changePassword'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Post)('toPublic'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "toPublic", null);
__decorate([
    (0, common_1.Post)('toPrivate'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "toPrivate", null);
exports.ChannelController = ChannelController = __decorate([
    (0, common_1.Controller)('channels'),
    __metadata("design:paramtypes", [channel_service_1.ChannelService, channels_users_service_1.ChannelsUsersService, session_service_1.SessionService])
], ChannelController);
//# sourceMappingURL=channel.controller.js.map