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
exports.BlockshipService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let BlockshipService = exports.BlockshipService = class BlockshipService {
    constructor(blockshipRepository) {
        this.blockshipRepository = blockshipRepository;
    }
    async findAll() {
        return this.blockshipRepository.find();
    }
    async findUserblockedFromId(id) {
        const blockships = await this.blockshipRepository
            .createQueryBuilder('blockships')
            .innerJoinAndSelect('blockships.userblocking', 'userblocking')
            .innerJoinAndSelect('blockships.userblocked', 'userblocked')
            .where('userblocking.id = :id', { id: id })
            .getMany();
        const users = blockships.map((blockship) => ({
            id: blockship.userblocked.id,
            pseudo: blockship.userblocked.pseudo,
            profilPic: blockship.userblocked.profilPic,
            isConnected: blockship.userblocked.isConnected
        }));
        return (users);
    }
    async deleteBlockship(friend_id, user_id) {
        const blockship = await this.blockshipRepository.findOne({
            where: { userblocking: { id: user_id }, userblocked: { id: friend_id } },
        });
        const res = await this.blockshipRepository.delete(blockship.id);
        return (res);
    }
};
exports.BlockshipService = BlockshipService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('BLOCKSHIP_REPOSITORY')),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], BlockshipService);
//# sourceMappingURL=blockship.service.js.map