"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockshipProviders = void 0;
const blockship_entity_1 = require("./blockship.entity");
exports.blockshipProviders = [
    {
        provide: 'BLOCKSHIP_REPOSITORY',
        useFactory: (dataSource) => dataSource.getRepository(blockship_entity_1.Blockships),
        inject: ['DATA_SOURCE'],
    },
];
//# sourceMappingURL=blockship.providers.js.map