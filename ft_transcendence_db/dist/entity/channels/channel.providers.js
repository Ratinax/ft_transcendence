"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.channelProviders = void 0;
const channel_entity_1 = require("./channel.entity");
exports.channelProviders = [
    {
        provide: 'CHANNEL_REPOSITORY',
        useFactory: (dataSource) => dataSource.getRepository(channel_entity_1.Channels),
        inject: ['DATA_SOURCE'],
    },
];
//# sourceMappingURL=channel.providers.js.map