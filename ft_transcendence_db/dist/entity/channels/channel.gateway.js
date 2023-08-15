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
let ChannelGateway = exports.ChannelGateway = class ChannelGateway {
    constructor(channelService, channelsUsersService) {
        this.channelService = channelService;
        this.channelsUsersService = channelsUsersService;
    }
    async create(data) {
        if (!this.createGoodInputs(data.channel, data.user))
            return ('input error');
        const channel = data.channel;
        const user = data.user;
        try {
            const response = await this.channelService.createChannel(channel);
            this.server.emit('updateListChannels', { channel: response, user: user });
            const response2 = await this.channelsUsersService.createNew({
                user: user,
                channel: response,
                isAdmin: true,
                isOwner: true,
                isInvited: false,
            });
            this.server.emit('createGoodRequest', { user: user });
            return ({ response, response2 });
        }
        catch (e) {
            this.server.emit('createAlreadyExists', { user: user });
        }
    }
    createGoodInputs(channel, user) {
        if (channel.name.length < 3
            || channel.name.length > 20 ||
            ((channel.password.length < 3
                || channel.password.length > 20) && channel.category === 'Protected by password')) {
            this.server.emit('createPasswordOrNameWrongSize', { user: user });
            return (false);
        }
        if (channel.category !== 'Private'
            && channel.category !== 'Public'
            && channel.category !== 'Protected by password') {
            this.server.emit('createWrongCategory', { user: user });
            return (false);
        }
        return (true);
    }
    async join(body) {
        const password = body.password;
        const channelName = body.channelName;
        const user = body.user;
        let channel;
        try {
            const channels = await this.channelService.findByName(channelName);
            if (!channels || !channels[0])
                throw new common_1.InternalServerErrorException('no such channel');
            channel = channels[0];
        }
        catch (e) {
            this.server.emit('joinNoSuchChannel', { user: user });
        }
        const relation = await this.channelsUsersService.findRelation(user.id, channel.channel_id);
        if (relation && relation[0]) {
            if (relation[0].isBanned === true)
                this.server.emit('joinBanned', { user: user });
            else
                this.server.emit('joinAlreadyIn', { user: user });
            return;
        }
        if (channel.category === 'Private') {
            this.server.emit('joinPrivateMode', { user: user });
            return;
        }
        if (!await this.channelService.comparePasswords(channel, password)) {
            this.server.emit('joinWrongPassword', { user: user });
            return;
        }
        await this.channelsUsersService.createNew({
            user: user,
            channel: channel,
            isAdmin: false,
            isOwner: false,
            isInvited: false,
        });
        this.server.emit('updateListChannels', { channel: channel, user: user });
        this.server.emit('joinGoodRequest', { channel: channel, user: user });
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
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [channel_service_1.ChannelService, channels_users_service_1.ChannelsUsersService])
], ChannelGateway);
//# sourceMappingURL=channel.gateway.js.map