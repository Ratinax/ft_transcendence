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
exports.ChannelService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const bcrypt = require("bcrypt");
let ChannelService = exports.ChannelService = class ChannelService {
    constructor(channelRepository) {
        this.channelRepository = channelRepository;
    }
    async findByName(channelName) {
        return this.channelRepository
            .createQueryBuilder('channel')
            .where('channel.name = :name', { name: channelName })
            .getMany();
    }
    async createChannel(channel) {
        const channelAllreadyExisting = await this.channelRepository.findOne({ where: { name: channel.name } });
        if (channelAllreadyExisting) {
            throw new common_1.InternalServerErrorException('channel allready exists');
        }
        const passwordHashed = await this.hashedPassword(channel.password);
        const finalChannel = { ...channel, password: passwordHashed };
        const newChannel = this.channelRepository.create(finalChannel);
        const res = await this.channelRepository.save(newChannel);
        return ({
            isADm: res.isADm,
            name: res.name,
            category: res.category,
            channel_id: res.channel_id,
        });
    }
    async setPassword(channel, password) {
        if (password.length > 20 || password.length < 3)
            throw new common_1.InternalServerErrorException('Password not good length');
        const relation = await this.channelRepository.findOne({ where: { channel_id: channel.channel_id } });
        const passwordHashed = await this.hashedPassword(password);
        relation.category = 'Protected by password';
        relation.password = passwordHashed;
        const res = await this.channelRepository.save(relation);
        return ({
            isADm: res.isADm,
            name: res.name,
            category: res.category,
            channel_id: res.channel_id,
        });
    }
    async removePassword(channel) {
        const relation = await this.channelRepository.findOne({ where: { channel_id: channel.channel_id } });
        relation.category = 'Public';
        relation.password = '';
        const res = await this.channelRepository.save(relation);
        return ({ isADm: res.isADm,
            name: res.name,
            category: res.category,
            channel_id: res.channel_id, });
    }
    async changePassword(channel, password) {
        if (password.length > 20 || password.length < 3)
            throw new common_1.InternalServerErrorException('Password not good length');
        const relation = await this.channelRepository.findOne({ where: { channel_id: channel.channel_id } });
        const passwordHashed = await this.hashedPassword(password);
        relation.category = 'Protected by password';
        relation.password = passwordHashed;
        const res = await this.channelRepository.save(relation);
        return ({ isADm: res.isADm,
            name: res.name,
            category: res.category,
            channel_id: res.channel_id, });
    }
    async comparePasswords(channel, password) {
        return (await bcrypt.compare(password + process.env.PEPPER, channel.password));
    }
    async hashedPassword(password) {
        return (await bcrypt.hash(password + process.env.PEPPER, +process.env.SALTROUNDS));
    }
};
exports.ChannelService = ChannelService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CHANNEL_REPOSITORY')),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], ChannelService);
//# sourceMappingURL=channel.service.js.map