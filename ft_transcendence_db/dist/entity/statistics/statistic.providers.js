"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statisticProviders = void 0;
const statistic_entity_1 = require("./statistic.entity");
exports.statisticProviders = [
    {
        provide: 'STATISTIC_REPOSITORY',
        useFactory: (dataSource) => dataSource.getRepository(statistic_entity_1.Statistics),
        inject: ['DATA_SOURCE'],
    },
];
//# sourceMappingURL=statistic.providers.js.map