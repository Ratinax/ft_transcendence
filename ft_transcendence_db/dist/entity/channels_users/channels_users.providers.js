"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.channelsUsersProviders = void 0;
const channels_users_entity_1 = require("./channels_users.entity");
exports.channelsUsersProviders = [
    {
        provide: 'CHANNELSUSERS_REPOSITORY',
        useFactory: (dataSource) => dataSource.getRepository(channels_users_entity_1.ChannelsUsers),
        inject: ['DATA_SOURCE'],
    },
];
//# sourceMappingURL=channels_users.providers.js.map