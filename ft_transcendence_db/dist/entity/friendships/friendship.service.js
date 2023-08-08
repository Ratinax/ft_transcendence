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
exports.FriendshipService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let FriendshipService = exports.FriendshipService = class FriendshipService {
    constructor(friendshipRepository) {
        this.friendshipRepository = friendshipRepository;
    }
    async findFriendOfId(id) {
        const friendshipsFromFriend = await this.friendshipRepository
            .createQueryBuilder('friendships')
            .innerJoinAndSelect('friendships.user', 'user')
            .innerJoinAndSelect('friendships.friend', 'friend')
            .where(`user.id = :id AND statu = 'accepted'`, { id: id })
            .getMany();
        const friendshipsFromUser = await this.friendshipRepository
            .createQueryBuilder('friendships')
            .innerJoinAndSelect('friendships.user', 'user')
            .innerJoinAndSelect('friendships.friend', 'friend')
            .where(`friend.id = :id AND statu = 'accepted'`, { id: id })
            .getMany();
        const usersFromFriend = friendshipsFromFriend.map((friendship) => ({
            id: friendship.friend.id,
            pseudo: friendship.friend.pseudo,
            profilPic: friendship.friend.profilPic,
            isConnected: friendship.friend.isConnected
        }));
        const usersFromUser = friendshipsFromUser.map((friendship) => ({
            id: friendship.user.id,
            pseudo: friendship.user.pseudo,
            profilPic: friendship.user.profilPic,
            isConnected: friendship.user.isConnected
        }));
        return ([...usersFromFriend, ...usersFromUser]);
    }
    async findPending(id) {
        const friensdAsking = await this.friendshipRepository
            .createQueryBuilder('friendships')
            .innerJoinAndSelect('friendships.user', 'user')
            .innerJoinAndSelect('friendships.friend', 'friend')
            .where(`friend.id = :id AND statu = 'pending'`, { id: id })
            .getMany();
        const usersAsking = friensdAsking.map((friendship) => ({
            id: friendship.user.id,
            pseudo: friendship.user.pseudo,
            profilPic: friendship.user.profilPic,
            isConnected: friendship.user.isConnected
        }));
        return (usersAsking);
    }
    async acceptFriendship(friend_id, user_id) {
        const friendship = await this.friendshipRepository.findOne({
            where: { user: { id: user_id }, friend: { id: friend_id } },
        });
        if (!friendship) {
            throw new Error('Friendship not found.');
        }
        friendship.statu = 'accepted';
        return this.friendshipRepository.save(friendship);
    }
    async deleteFriendship(friend_id, user_id) {
        let friendship = await this.friendshipRepository.findOne({
            where: { user: { id: user_id }, friend: { id: friend_id } },
        });
        if (!friendship) {
            friendship = await this.friendshipRepository.findOne({
                where: { user: { id: friend_id }, friend: { id: user_id } },
            });
        }
        if (!friendship)
            throw new Error('no such friendship.');
        const res = await this.friendshipRepository.delete(friendship.id);
        return (res);
    }
};
exports.FriendshipService = FriendshipService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('FRIENDSHIP_REPOSITORY')),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], FriendshipService);
//# sourceMappingURL=friendship.service.js.map