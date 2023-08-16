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
exports.Messages = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const channel_entity_1 = require("../channels/channel.entity");
let Messages = exports.Messages = class Messages {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Messages.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.Users, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.Users)
], Messages.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => channel_entity_1.Channels, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'channel_id' }),
    __metadata("design:type", channel_entity_1.Channels)
], Messages.prototype, "channel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date_sent', type: 'timestamp' }),
    __metadata("design:type", Date)
], Messages.prototype, "dateSent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Messages.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Messages.prototype, "isAGameInvite", void 0);
exports.Messages = Messages = __decorate([
    (0, typeorm_1.Entity)()
], Messages);
//# sourceMappingURL=message.entity.js.map