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
let ChannelsUsersGateway = exports.ChannelsUsersGateway = class ChannelsUsersGateway {
    constructor(channelsUsersService) {
        this.channelsUsersService = channelsUsersService;
    }
    async findUsersOfChannel(body) {
        try {
            const res = await this.channelsUsersService.findUsersOfChannel(body.channel.name);
            this.server.emit('updateListUsers', { users: res, channel: body.channel });
        }
        catch (e) {
            console.log(e);
        }
    }
    async ban(body) {
        const res = await this.channelsUsersService.ban(body.channel, body.userBanned);
        const users = await this.channelsUsersService.findUsersOfChannel(body.channel.name);
        this.server.emit('updateAfterBan', {
            users: users,
            channel: body.channel,
            userBanned: body.userBanned
        });
        return (res);
    }
    async kick(body) {
        const res = await this.channelsUsersService.kick(body.channel, body.userKicked);
        const users = await this.channelsUsersService.findUsersOfChannel(body.channel.name);
        this.server.emit('updateAfterKick', {
            users: users,
            channel: body.channel,
            userKicked: body.userKicked
        });
        return (res);
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
exports.ChannelsUsersGateway = ChannelsUsersGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [channels_users_service_1.ChannelsUsersService])
], ChannelsUsersGateway);
//# sourceMappingURL=channels_users.gateway.js.map