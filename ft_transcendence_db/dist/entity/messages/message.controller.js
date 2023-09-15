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
exports.MessageController = void 0;
const common_1 = require("@nestjs/common");
const message_service_1 = require("./message.service");
const blockship_service_1 = require("../blockships/blockship.service");
const session_service_1 = require("../sessions/session.service");
let MessageController = exports.MessageController = class MessageController {
    constructor(messageService, blockshipService, sessionService) {
        this.messageService = messageService;
        this.blockshipService = blockshipService;
        this.sessionService = sessionService;
    }
    async find(channelname, req) {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY'])) {
            return (null);
        }
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        const listUserBlocked = await this.blockshipService.findUserblockedFromId(user.id);
        let listUserBlockedId = [];
        for (let i = 0; i < listUserBlocked.length; i++) {
            listUserBlockedId.push(listUserBlocked[i].id);
        }
        const res = await this.messageService.findMessageFromChannel(channelname, listUserBlockedId, user.id);
        return (res);
    }
    async post(body) {
        return (await this.messageService.post(body));
    }
};
__decorate([
    (0, common_1.Get)(':channelname'),
    __param(0, (0, common_1.Param)('channelname')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "find", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "post", null);
exports.MessageController = MessageController = __decorate([
    (0, common_1.Controller)('messages'),
    __metadata("design:paramtypes", [message_service_1.MessageService, blockship_service_1.BlockshipService, session_service_1.SessionService])
], MessageController);
//# sourceMappingURL=message.controller.js.map