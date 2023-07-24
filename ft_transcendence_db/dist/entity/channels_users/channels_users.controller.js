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
let ChannelsUsersController = exports.ChannelsUsersController = class ChannelsUsersController {
    constructor(channelsUsersService) {
        this.channelsUsersService = channelsUsersService;
    }
    async findAll() {
        return (await this.channelsUsersService.findAll());
    }
    async createNew(body) {
        return (await this.channelsUsersService.createNew(body));
    }
};
__decorate([
    (0, common_1.Get)(''),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChannelsUsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(''),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChannelsUsersController.prototype, "createNew", null);
exports.ChannelsUsersController = ChannelsUsersController = __decorate([
    (0, common_1.Controller)('channels_users'),
    __metadata("design:paramtypes", [channels_users_service_1.ChannelsUsersService])
], ChannelsUsersController);
//# sourceMappingURL=channels_users.controller.js.map