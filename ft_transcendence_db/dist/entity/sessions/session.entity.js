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
exports.Sessions = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
let Sessions = exports.Sessions = class Sessions {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Sessions.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.Users, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", Object)
], Sessions.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'session_key', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Sessions.prototype, "sessionKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expiration_date', type: 'timestamp' }),
    __metadata("design:type", Date)
], Sessions.prototype, "expirationDate", void 0);
exports.Sessions = Sessions = __decorate([
    (0, typeorm_1.Entity)()
], Sessions);
//# sourceMappingURL=session.entity.js.map