"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameProviders = void 0;
const game_entity_1 = require("./game.entity");
exports.gameProviders = [
    {
        provide: 'GAME_REPOSITORY',
        useFactory: (dataSource) => dataSource.getRepository(game_entity_1.Games),
        inject: ['DATA_SOURCE'],
    },
];
//# sourceMappingURL=game.providers.js.map