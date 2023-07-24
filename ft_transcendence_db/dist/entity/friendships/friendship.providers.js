"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.friendshipProviders = void 0;
const friendship_entity_1 = require("./friendship.entity");
exports.friendshipProviders = [
    {
        provide: 'FRIENDSHIP_REPOSITORY',
        useFactory: (dataSource) => dataSource.getRepository(friendship_entity_1.Friendships),
        inject: ['DATA_SOURCE'],
    },
];
//# sourceMappingURL=friendship.providers.js.map