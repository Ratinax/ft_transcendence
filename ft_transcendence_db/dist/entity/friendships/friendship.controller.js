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
exports.FriendshipController = void 0;
const common_1 = require("@nestjs/common");
const friendship_service_1 = require("./friendship.service");
let FriendshipController = exports.FriendshipController = class FriendshipController {
    constructor(friendshipService) {
        this.friendshipService = friendshipService;
    }
    async findAll() {
        return (await this.friendshipService.findAll());
    }
    async findFriendOfId(id) {
        return (await this.friendshipService.findFriendOfId(id));
    }
};
__decorate([
    (0, common_1.Get)(''),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FriendshipController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('friendsof/:id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FriendshipController.prototype, "findFriendOfId", null);
exports.FriendshipController = FriendshipController = __decorate([
    (0, common_1.Controller)('friendships'),
    __metadata("design:paramtypes", [friendship_service_1.FriendshipService])
], FriendshipController);
//# sourceMappingURL=friendship.controller.js.map