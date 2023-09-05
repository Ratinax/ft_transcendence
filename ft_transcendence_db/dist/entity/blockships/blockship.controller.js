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
exports.BlockshipController = void 0;
const common_1 = require("@nestjs/common");
const blockship_service_1 = require("./blockship.service");
const session_service_1 = require("../sessions/session.service");
let BlockshipController = exports.BlockshipController = class BlockshipController {
    constructor(blockshipService, sessionService) {
        this.blockshipService = blockshipService;
        this.sessionService = sessionService;
    }
    async findUserblockedFromId(req) {
        if (!req.cookies['SESSION_KEY'] || !this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY'])) {
            return (null);
        }
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        try {
            const res = await this.blockshipService.findUserblockedFromId(user.id);
            return (res);
        }
        catch (e) {
            return (null);
        }
    }
};
__decorate([
    (0, common_1.Get)('userblockedby'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlockshipController.prototype, "findUserblockedFromId", null);
exports.BlockshipController = BlockshipController = __decorate([
    (0, common_1.Controller)('blockships'),
    __metadata("design:paramtypes", [blockship_service_1.BlockshipService, session_service_1.SessionService])
], BlockshipController);
//# sourceMappingURL=blockship.controller.js.map