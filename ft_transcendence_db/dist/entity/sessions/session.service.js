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
exports.SessionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let SessionService = exports.SessionService = class SessionService {
    constructor(sessionRepository) {
        this.sessionRepository = sessionRepository;
    }
    async createSession(user_id) {
        const sessionKey = this.generateRandomString(42);
        const session = {
            user: {
                id: user_id,
            },
            sessionKey: sessionKey,
            expirationDate: new Date(Date.now() + 10000),
        };
        const newSession = this.sessionRepository.create(session);
        const res = await this.sessionRepository.save(newSession);
        return (res);
    }
    async getUser(sessionKey) {
        if (await this.getIsSessionExpired(sessionKey)) {
            return (null);
        }
        const relations = await this.sessionRepository
            .createQueryBuilder('sessions')
            .innerJoinAndSelect('sessions.user', 'user')
            .where('session_key LIKE :sessionKey', { sessionKey: sessionKey })
            .getMany();
        const user = relations.map((sessions) => ({
            id: sessions.user.id,
            pseudo: sessions.user.pseudo,
            profilPic: sessions.user.profilPic,
        }));
        return (user[0]);
    }
    async getSessionKey(user_id) {
        const relation = await this.sessionRepository.findOne({ where: { user: { id: user_id } } });
        return (relation.sessionKey);
    }
    async getIsSessionExpired(sessionKey) {
        const relation = await this.sessionRepository.findOne({
            where: { sessionKey: sessionKey },
        });
        if (!relation) {
            return (true);
        }
        if (new Date(Date.now()) > relation.expirationDate) {
            return (true);
        }
        return (false);
    }
    async refreshSessionKey(sessionKey) {
        const relation = await this.sessionRepository.findOne({
            where: { sessionKey: sessionKey },
        });
        if (!relation)
            return (null);
        relation.expirationDate = new Date(Date.now() + 10000);
        const res = this.sessionRepository.save(relation);
        return (res);
    }
    async removeNoMoreConnected() {
        const relations = await this.sessionRepository
            .createQueryBuilder('sessions')
            .getMany();
        for (let i = 0; i < relations.length; i++) {
            if (relations[i].expirationDate < new Date(Date.now()))
                await this.sessionRepository.delete(relations[i].id);
        }
    }
    generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    }
};
exports.SessionService = SessionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('SESSION_REPOSITORY')),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], SessionService);
//# sourceMappingURL=session.service.js.map