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
exports.ChannelsUsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let ChannelsUsersService = exports.ChannelsUsersService = class ChannelsUsersService {
    constructor(channelsUsersRepository) {
        this.channelsUsersRepository = channelsUsersRepository;
    }
    createNew(channels_users) {
        const newRelation = this.channelsUsersRepository.create(channels_users);
        return (this.channelsUsersRepository.save(newRelation));
    }
    async findUsersOfChannel(channelName) {
        const usersAndChannels = await this.channelsUsersRepository
            .createQueryBuilder('channelsUsers')
            .innerJoinAndSelect('channelsUsers.user', 'user')
            .innerJoinAndSelect('channelsUsers.channel', 'channel')
            .where('channel.name = :channelName AND is_invited = false AND is_banned = false', { channelName })
            .getMany();
        const users = usersAndChannels.map((channelsUsers) => ({
            id: channelsUsers.user.id,
            pseudo: channelsUsers.user.pseudo,
            profilPic: channelsUsers.user.profilPic,
            isOwner: channelsUsers.isOwner,
            isAdmin: channelsUsers.isAdmin,
            isInvited: channelsUsers.isInvited,
            isBanned: channelsUsers.isBanned,
            dateTimeout: channelsUsers.dateTimeout,
            durationTimeout: channelsUsers.durationTimeout,
        }));
        return (users);
    }
    async findRelation(user_id, channel_id) {
        const relation = await this.channelsUsersRepository
            .createQueryBuilder('channelsUsers')
            .where('channel_id = :channel_id AND user_id = :user_id', { channel_id: channel_id, user_id: user_id })
            .getMany();
        return (relation);
    }
    async findChannelsOfUsers(user_id) {
        const usersAndChannels = await this.channelsUsersRepository
            .createQueryBuilder('channelsUsers')
            .innerJoinAndSelect('channelsUsers.user', 'user')
            .innerJoinAndSelect('channelsUsers.channel', 'channel')
            .where('user.id = :user_id AND is_invited = false AND is_banned = false', { user_id })
            .getMany();
        const channels = usersAndChannels.map((channelsUsers) => ({
            channel_id: channelsUsers.channel.channel_id,
            isADm: channelsUsers.channel.isADm,
            name: channelsUsers.channel.name,
            category: channelsUsers.channel.category,
        }));
        return (channels);
    }
    async ban(channel, user) {
        const relation = await this.findRelation(user.id, channel.channel_id);
        if (!relation || !relation[0])
            return (null);
        relation[0].isBanned = true;
        return (this.channelsUsersRepository.save(relation[0]));
    }
    async leave(channel, user) {
        const relation = await this.findRelation(user.id, channel.channel_id);
        if (relation)
            return (await this.channelsUsersRepository.remove(relation));
    }
    async setAdmin(channel, user) {
        const relation = await this.findRelation(user.id, channel.channel_id);
        if (!relation || !relation[0])
            return (null);
        relation[0].isAdmin = true;
        return (this.channelsUsersRepository.save(relation[0]));
    }
    async removeAdmin(channel, user) {
        const relation = await this.findRelation(user.id, channel.channel_id);
        if (!relation || !relation[0])
            return (null);
        relation[0].isAdmin = false;
        return (this.channelsUsersRepository.save(relation[0]));
    }
    getCurrentDate() {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        return formattedDate;
    }
    async timeoutUser(channel, user, duration) {
        const relation = await this.channelsUsersRepository.findOne({ where: {
                user: {
                    id: user.id,
                },
                channel: {
                    channel_id: channel.channel_id,
                }
            } });
        relation.dateTimeout = new Date(this.getCurrentDate());
        relation.durationTimeout = duration;
        return (this.channelsUsersRepository.save(relation));
    }
};
exports.ChannelsUsersService = ChannelsUsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CHANNELSUSERS_REPOSITORY')),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], ChannelsUsersService);
//# sourceMappingURL=channels_users.service.js.map