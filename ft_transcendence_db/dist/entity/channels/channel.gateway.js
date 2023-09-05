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
exports.ChannelGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const channel_service_1 = require("./channel.service");
const socket_io_1 = require("socket.io");
const channels_users_service_1 = require("../channels_users/channels_users.service");
const common_1 = require("@nestjs/common");
const session_service_1 = require("../sessions/session.service");
const config_ip_1 = require("../../config-ip");
function getWebSocketGatewayOptions() {
    return {
        cors: {
            origin: `http://${config_ip_1.ConfigIp.IP}:8080`,
            credentials: true,
        },
    };
}
let ChannelGateway = exports.ChannelGateway = class ChannelGateway {
    constructor(channelService, channelsUsersService, sessionService) {
        this.channelService = channelService;
        this.channelsUsersService = channelsUsersService;
        this.sessionService = sessionService;
    }
    async create(data) {
        if (await this.sessionService.getIsSessionExpired(data.sessionCookie)) {
            return ('not connected');
        }
        const user = await this.sessionService.getUser(data.sessionCookie);
        if (!this.createGoodInputs(data.channel, data.sessionCookie))
            return ('input error');
        const channel = data.channel;
        try {
            const response = await this.channelService.createChannel(channel);
            this.server.emit('updateListChannels', { channel: response, sessionCookie: data.sessionCookie });
            const response2 = await this.channelsUsersService.createNew({
                user: user,
                channel: response,
                isAdmin: true,
                isOwner: true,
                isInvited: false,
            });
            this.server.emit('createGoodRequest', { sessionCookie: data.sessionCookie });
            return ({ response, response2 });
        }
        catch (e) {
            this.server.emit('createAlreadyExists', { sessionCookie: data.sessionCookie });
        }
    }
    createGoodInputs(channel, sessionCookie) {
        if (channel.name.length < 3
            || channel.name.length > 20 ||
            ((channel.password.length < 3
                || channel.password.length > 20) && channel.category === 'Protected by password')) {
            this.server.emit('createPasswordOrNameWrongSize', { sessionCookie: sessionCookie });
            return (false);
        }
        if (channel.category !== 'Private'
            && channel.category !== 'Public'
            && channel.category !== 'Protected by password') {
            this.server.emit('createWrongCategory', { sessionCookie: sessionCookie });
            return (false);
        }
        return (true);
    }
    async join(body) {
        if (await this.sessionService.getIsSessionExpired(body.sessionCookie)) {
            return ('not connected');
        }
        const user = await this.sessionService.getUser(body.sessionCookie);
        const password = body.password;
        const channelName = body.channelName;
        let channel;
        try {
            const channels = await this.channelService.findByName(channelName);
            if (!channels || !channels[0])
                throw new common_1.InternalServerErrorException('no such channel');
            channel = channels[0];
        }
        catch (e) {
            this.server.emit('joinNoSuchChannel', { sessionCookie: body.sessionCookie });
            return;
        }
        const relation = await this.channelsUsersService.findRelation(user.id, channel.channel_id);
        if (relation && relation[0]) {
            if (relation[0].isBanned === true)
                this.server.emit('joinBanned', { sessionCookie: body.sessionCookie });
            else
                this.server.emit('joinAlreadyIn', { sessionCookie: body.sessionCookie });
            return;
        }
        if (channel.category === 'Private') {
            this.server.emit('joinPrivateMode', { sessionCookie: body.sessionCookie });
            return;
        }
        if (!await this.channelService.comparePasswords(channel, password)) {
            this.server.emit('joinWrongPassword', { sessionCookie: body.sessionCookie });
            return;
        }
        await this.channelsUsersService.createNew({
            user: user,
            channel: channel,
            isAdmin: false,
            isOwner: false,
            isInvited: false,
        });
        console.log(channel);
        const channelToReturn = {
            channel_id: channel.channel_id,
        };
        this.server.emit('updateListChannels', { channel: channelToReturn, sessionCookie: body.sessionCookie });
        this.server.emit('joinGoodRequest', { sessionCookie: body.sessionCookie });
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChannelGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('createChannel'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChannelGateway.prototype, "create", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinChannel'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChannelGateway.prototype, "join", null);
exports.ChannelGateway = ChannelGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(3001, getWebSocketGatewayOptions()),
    __metadata("design:paramtypes", [channel_service_1.ChannelService, channels_users_service_1.ChannelsUsersService, session_service_1.SessionService])
], ChannelGateway);
//# sourceMappingURL=channel.gateway.js.map