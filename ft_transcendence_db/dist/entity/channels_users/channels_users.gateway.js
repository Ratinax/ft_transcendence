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
exports.ChannelsUsersGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const channels_users_service_1 = require("./channels_users.service");
const socket_io_1 = require("socket.io");
const session_service_1 = require("../sessions/session.service");
let ChannelsUsersGateway = exports.ChannelsUsersGateway = class ChannelsUsersGateway {
    constructor(channelsUsersService, sessionService) {
        this.channelsUsersService = channelsUsersService;
        this.sessionService = sessionService;
    }
    async findUsersOfChannel(body) {
        if (await this.sessionService.getIsSessionExpired(body.sessionCookie)) {
            return ('not connected');
        }
        const user = await this.sessionService.getUser(body.sessionCookie);
        try {
            const res = await this.channelsUsersService.findUsersOfChannel(body.channel.name);
            this.server.emit('updateListUsers', { users: res, channel: body.channel });
        }
        catch (e) {
        }
    }
    async ban(body) {
        if (await this.sessionService.getIsSessionExpired(body.sessionCookie)) {
            return ('not connected');
        }
        const user = await this.sessionService.getUser(body.sessionCookie);
        const res = await this.channelsUsersService.ban(body.channel, body.userBanned);
        const users = await this.channelsUsersService.findUsersOfChannel(body.channel.name);
        this.server.emit('updateAfterPart', {
            users: users,
            channel: body.channel,
            sessionCookie: await this.sessionService.getSessionKey(body.userBanned.id)
        });
        return (res);
    }
    async kick(body) {
        if (await this.sessionService.getIsSessionExpired(body.sessionCookie)) {
            return ('not connected');
        }
        const user = await this.sessionService.getUser(body.sessionCookie);
        const res = await this.channelsUsersService.leave(body.channel, body.userKicked);
        const users = await this.channelsUsersService.findUsersOfChannel(body.channel.name);
        this.server.emit('updateAfterPart', {
            users: users,
            channel: body.channel,
            sessionCookie: await this.sessionService.getSessionKey(body.userKicked.id)
        });
        return (res);
    }
    async leaveChannel(body) {
        if (await this.sessionService.getIsSessionExpired(body.sessionCookie)) {
            return ('not connected');
        }
        const user = await this.sessionService.getUser(body.sessionCookie);
        const res = await this.channelsUsersService.leave(body.channel, user);
        const users = await this.channelsUsersService.findUsersOfChannel(body.channel.name);
        this.server.emit('updateAfterPart', {
            users: users,
            channel: body.channel,
            body: body.sessionCookie
        });
        return (res);
    }
    async setAdmin(body) {
        if (await this.sessionService.getIsSessionExpired(body.sessionCookie)) {
            return ('not connected');
        }
        const res = await this.channelsUsersService.setAdmin(body.channel, body.userSetAdmin);
        const users = await this.channelsUsersService.findUsersOfChannel(body.channel.name);
        this.server.emit('updateListUsers', {
            users: users,
            channel: body.channel
        });
        return (res);
    }
    async removeAdmin(body) {
        if (await this.sessionService.getIsSessionExpired(body.sessionCookie)) {
            return ('not connected');
        }
        const user = await this.sessionService.getUser(body.sessionCookie);
        const res = await this.channelsUsersService.removeAdmin(body.channel, body.userRemovedAdmin);
        const users = await this.channelsUsersService.findUsersOfChannel(body.channel.name);
        this.server.emit('updateListUsers', {
            users: users,
            channel: body.channel
        });
        return (res);
    }
    async timeoutUser(body) {
        if (await this.sessionService.getIsSessionExpired(body.sessionCookie)) {
            return ('not connected');
        }
        const user = await this.sessionService.getUser(body.sessionCookie);
        if (body.duration_timeout >= 2592000 || body.duration_timeout < 10) {
            this.server.emit('timeoutWrongAmount', { channel: body.channel, sessionCookie: body.sessionCookie });
            return;
        }
        await this.channelsUsersService.timeoutUser(body.channel, body.userTimeouted, body.duration_timeout);
        const users = await this.channelsUsersService.findUsersOfChannel(body.channel.name);
        this.server.emit('updateListUsers', { channel: body.channel, users: users });
        this.server.emit('timeoutGoodRequest', { channel: body.channel, sessionCookie: body.sessionCookie });
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChannelsUsersGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('findUsersOfChannel'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChannelsUsersGateway.prototype, "findUsersOfChannel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('banUser'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChannelsUsersGateway.prototype, "ban", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('kickUser'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChannelsUsersGateway.prototype, "kick", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveChannel'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChannelsUsersGateway.prototype, "leaveChannel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('setAdmin'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChannelsUsersGateway.prototype, "setAdmin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('removeAdmin'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChannelsUsersGateway.prototype, "removeAdmin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('timeoutUser'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChannelsUsersGateway.prototype, "timeoutUser", null);
exports.ChannelsUsersGateway = ChannelsUsersGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(3001, {
        cors: {
            origin: `http://192.168.1.159:8080`,
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [channels_users_service_1.ChannelsUsersService, session_service_1.SessionService])
], ChannelsUsersGateway);
//# sourceMappingURL=channels_users.gateway.js.map