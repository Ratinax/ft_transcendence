"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigIp = void 0;
const dotenv = require("dotenv");
dotenv.config();
exports.ConfigIp = {
    IP: process.env.IP_ADDRESS || 'localhost',
};
//# sourceMappingURL=config-ip.js.map