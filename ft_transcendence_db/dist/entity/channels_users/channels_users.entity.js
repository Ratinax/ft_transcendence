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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelsUsers = void 0;
const channel_entity_1 = require("../channels/channel.entity");
const user_entity_1 = require("../users/user.entity");
const typeorm_1 = require("typeorm");
let ChannelsUsers = exports.ChannelsUsers = class ChannelsUsers {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ChannelsUsers.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.Users, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.Users)
], ChannelsUsers.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => channel_entity_1.Channels, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'channel_id' }),
    __metadata("design:type", channel_entity_1.Channels)
], ChannelsUsers.prototype, "channel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_admin', default: false }),
    __metadata("design:type", Boolean)
], ChannelsUsers.prototype, "isAdmin", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_owner', default: false }),
    __metadata("design:type", Boolean)
], ChannelsUsers.prototype, "isOwner", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_invited', default: false }),
    __metadata("design:type", Boolean)
], ChannelsUsers.prototype, "isInvited", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_banned', default: false }),
    __metadata("design:type", Boolean)
], ChannelsUsers.prototype, "isBanned", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date_timeout', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], ChannelsUsers.prototype, "dateTimeout", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'duration_timeout', type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], ChannelsUsers.prototype, "durationTimeout", void 0);
exports.ChannelsUsers = ChannelsUsers = __decorate([
    (0, typeorm_1.Entity)()
], ChannelsUsers);
//# sourceMappingURL=channels_users.entity.js.map