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
exports.MessagesGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const message_service_1 = require("./message.service");
const socket_io_1 = require("socket.io");
const channels_users_service_1 = require("../channels_users/channels_users.service");
const common_1 = require("@nestjs/common");
let MessagesGateway = exports.MessagesGateway = class MessagesGateway {
    constructor(messagesService, channelsUsersService) {
        this.messagesService = messagesService;
        this.channelsUsersService = channelsUsersService;
    }
    async create(body) {
        const relation = await this.channelsUsersService.findRelation(body.user_id, body.channel_id);
        if (!relation || !relation[0])
            throw new common_1.InternalServerErrorException('no such relation');
        const timeoutDate = new Date(relation[0].dateTimeout);
        const currentDate = new Date(body.dateSent);
        const timeoutDuration = relation[0].durationTimeout;
        const timeoutSeconds = timeoutDate.getTime() / 1000;
        const currentSeconds = currentDate.getTime() / 1000;
        if (timeoutSeconds + +timeoutDuration > currentSeconds) {
            this.server.emit('sendMessageTimeout', { channel_id: body.channel_id, user_id: body.user_id, duration: timeoutSeconds + +timeoutDuration - currentSeconds });
            return 'user timeout';
        }
        const response = await this.messagesService.post({
            content: body.message,
            dateSent: body.dateSent,
            channel: body.channel_id,
            user: body.user_id,
            isAGameInvite: body.isAGameInvite,
        });
        this.server.emit('updateMessage', { channel_id: body.channel_id });
        this.server.emit('sendMessageGoodRequest', { channel_id: body.channel_id, user_id: body.user_id });
        return response;
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MessagesGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('createMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "create", null);
exports.MessagesGateway = MessagesGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(3002, {
        cors: {
            origin: `http://192.168.1.159:8080`,
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [message_service_1.MessageService, channels_users_service_1.ChannelsUsersService])
], MessagesGateway);
//# sourceMappingURL=message.gateway.js.map