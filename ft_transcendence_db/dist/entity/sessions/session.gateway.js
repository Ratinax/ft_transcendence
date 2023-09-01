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
exports.SessionGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const session_service_1 = require("./session.service");
const socket_io_1 = require("socket.io");
const config_ip_1 = require("../../config-ip");
let SessionGateway = exports.SessionGateway = class SessionGateway {
    constructor(sessionService) {
        this.sessionService = sessionService;
    }
    onModuleInit() {
        this.pingUsersThread();
    }
    pingUsersThread() {
        setInterval(() => {
            this.pingUsers();
        }, 5000);
    }
    async pingUsers() {
        setTimeout(async () => {
            this.server.emit('pingAlive');
        }, 2500);
        setTimeout(async () => {
            await this.sessionService.removeNoMoreConnected();
        }, 5000);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], SessionGateway.prototype, "server", void 0);
exports.SessionGateway = SessionGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(3003, {
        cors: {
            origin: `http://${config_ip_1.ConfigIp.IP}:8080`,
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [session_service_1.SessionService])
], SessionGateway);
//# sourceMappingURL=session.gateway.js.map