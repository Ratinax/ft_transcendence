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
exports.FriendshipGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const friendship_service_1 = require("./friendship.service");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const session_service_1 = require("../sessions/session.service");
const config_ip_1 = require("../../config-ip");
let FriendshipGateway = exports.FriendshipGateway = class FriendshipGateway {
    constructor(friendshipService, sessionService) {
        this.friendshipService = friendshipService;
        this.sessionService = sessionService;
    }
    async acceptFriendship(body) {
        if (await this.sessionService.getIsSessionExpired(body.sessionCookie)) {
            return ('not connected');
        }
        const user = await this.sessionService.getUser(body.sessionCookie);
        await this.friendshipService.acceptFriendship(user.id, body.friend_id);
        this.server.emit('acceptFriendship', { sessionCookie: body.sessionCookie });
    }
    async removeFriendship(body) {
        if (await this.sessionService.getIsSessionExpired(body.sessionCookie)) {
            return ('not connected');
        }
        const user = await this.sessionService.getUser(body.sessionCookie);
        try {
            await this.friendshipService.deleteFriendship(body.friend_id, user.id);
            this.server.emit('deleteFriendship', { sessionCookie: body.sessionCookie });
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], FriendshipGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('acceptFriendship'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FriendshipGateway.prototype, "acceptFriendship", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('removeFriendship'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FriendshipGateway.prototype, "removeFriendship", null);
exports.FriendshipGateway = FriendshipGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(3002, {
        cors: {
            origin: `http://${config_ip_1.ConfigIp.IP}:8080`,
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [friendship_service_1.FriendshipService, session_service_1.SessionService])
], FriendshipGateway);
//# sourceMappingURL=friendship.gateway.js.map