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
exports.Statistics = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
let Statistics = exports.Statistics = class Statistics {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Statistics.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.Users, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'player_one' }),
    __metadata("design:type", user_entity_1.Users)
], Statistics.prototype, "playerOne", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.Users, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'player_two' }),
    __metadata("design:type", user_entity_1.Users)
], Statistics.prototype, "playerTwo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'score_p_one', default: 0 }),
    __metadata("design:type", Number)
], Statistics.prototype, "scorePOne", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'score_p_two', default: 0 }),
    __metadata("design:type", Number)
], Statistics.prototype, "scorePTwo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_game_over', default: 0 }),
    __metadata("design:type", Boolean)
], Statistics.prototype, "isGameOver", void 0);
exports.Statistics = Statistics = __decorate([
    (0, typeorm_1.Entity)()
], Statistics);
//# sourceMappingURL=statistic.entity.js.map