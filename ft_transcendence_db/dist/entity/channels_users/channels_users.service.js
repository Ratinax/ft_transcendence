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
    async findAll() {
        return this.channelsUsersRepository.find();
    }
    async findUsersOfChannel(channelName) {
        const usersAndChannels = await this.channelsUsersRepository
            .createQueryBuilder('channelsUsers')
            .innerJoinAndSelect('channelsUsers.user', 'user')
            .innerJoinAndSelect('channelsUsers.channel', 'channel')
            .where('channel.name = :channelName', { channelName })
            .getMany();
        const users = usersAndChannels.map((channelsUsers) => ({
            id: channelsUsers.user.id,
            pseudo: channelsUsers.user.pseudo,
            password: channelsUsers.user.password,
            profilPic: channelsUsers.user.profilPic,
            isConnected: channelsUsers.user.isConnected,
            isOwner: channelsUsers.isOwner,
            isAdmin: channelsUsers.isAdmin,
            isInvited: channelsUsers.isInvited
        }));
        return (users);
    }
    createNew(channels_users) {
        const newRelation = this.channelsUsersRepository.create(channels_users);
        return (this.channelsUsersRepository.save(newRelation));
    }
    async findRelation(user_id, channel_id) {
        console.log('les u id :', user_id, channel_id);
        const relation = await this.channelsUsersRepository
            .createQueryBuilder('channelsUsers')
            .where('channel_id = :channel_id AND user_id = :user_id', { channel_id: channel_id, user_id: user_id })
            .getMany();
        console.log('la relation :', relation);
        return (relation);
    }
    async findChannelsOfUsers(user_id) {
        const usersAndChannels = await this.channelsUsersRepository
            .createQueryBuilder('channelsUsers')
            .innerJoinAndSelect('channelsUsers.user', 'user')
            .innerJoinAndSelect('channelsUsers.channel', 'channel')
            .where('user.id = :user_id AND is_invited = false', { user_id })
            .getMany();
        const channels = usersAndChannels.map((channelsUsers) => (channelsUsers.channel));
        return (channels);
    }
};
exports.ChannelsUsersService = ChannelsUsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CHANNELSUSERS_REPOSITORY')),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], ChannelsUsersService);
//# sourceMappingURL=channels_users.service.js.map