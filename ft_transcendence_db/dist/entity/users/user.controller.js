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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const path = require("path");
const session_service_1 = require("../sessions/session.service");
let UserController = exports.UserController = class UserController {
    constructor(userService, sessionService) {
        this.userService = userService;
        this.sessionService = sessionService;
    }
    async callFunction(fct, body) {
        try {
            const res = await this.userService.callFunction(fct.bind(this.userService), body);
            return (res);
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    async signUp(body, res) {
        const user = await this.callFunction(this.userService.signUp, body);
        const session = await this.sessionService.createSession(user.id);
        res.cookie('SESSION_KEY', session.sessionKey, { httpOnly: true, expires: new Date(session.expirationDate) });
        return (true);
    }
    async signIn(body, res) {
        const user = await this.callFunction(this.userService.signIn, body);
        if (!user || user === 'Wrong password')
            return (false);
        if (user.is42User)
            return (false);
        const session = await this.sessionService.createSession(user.id);
        res.cookie('SESSION_KEY', session.sessionKey, { httpOnly: true, expires: new Date(session.expirationDate) });
        return (true);
    }
    async getToken(code, res) {
        const token = await this.userService.getToken(code);
        if (token && token.data) {
            const infos = await this.userService.getMyInfos(token.data.access_token);
            const user = await this.callFunction(this.userService.login42, { pseudo: infos.data.login, profilPic: infos.data.image.link, is42User: true });
            if (!user)
                return (false);
            const session = await this.sessionService.createSession(user.id);
            res.cookie('SESSION_KEY', session.sessionKey, { httpOnly: true, expires: new Date(session.expirationDate) });
            res.cookie('42_TOKEN', token.data.access_token, { httpOnly: true, expires: new Date(Date.now() + token.data.expires_in * 1000) });
            res.cookie('42_REFRESH', token.data.refresh_token, { httpOnly: true, maxAge: 1000000000 });
            return (true);
        }
        return (false);
    }
    async logOut(body) {
        return (await this.callFunction(this.userService.logOut, body));
    }
    async getImageName(req) {
        if (!req.cookies['SESSION_KEY'] || !this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY'])) {
            return (null);
        }
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        if (user.is42User)
            return (user.profilPic);
        return (`http://${process.env.IP_ADDRESS}:3000/users/images/${user.profilPic}`);
    }
    async getImage(imageName, res) {
        let imagePath = path.join(__dirname, '../../../', 'images', imageName);
        return (res.sendFile(imagePath));
    }
    async getUsers(pseudoPart) {
        if (pseudoPart.length < 3)
            return ('Not enough chars');
        const res = await this.userService.getUsers(pseudoPart);
        return (res);
    }
};
__decorate([
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signUp", null);
__decorate([
    (0, common_1.Post)('signin'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signIn", null);
__decorate([
    (0, common_1.Get)('callback42/:code'),
    __param(0, (0, common_1.Param)('code')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getToken", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "logOut", null);
__decorate([
    (0, common_1.Get)('imageName'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getImageName", null);
__decorate([
    (0, common_1.Get)('/images/:imageName'),
    __param(0, (0, common_1.Param)('imageName')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getImage", null);
__decorate([
    (0, common_1.Get)(':pseudoPart'),
    __param(0, (0, common_1.Param)('pseudoPart')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUsers", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService, session_service_1.SessionService])
], UserController);
//# sourceMappingURL=user.controller.js.map