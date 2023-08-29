"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionProviders = void 0;
const session_entity_1 = require("./session.entity");
exports.sessionProviders = [
    {
        provide: 'SESSION_REPOSITORY',
        useFactory: (dataSource) => dataSource.getRepository(session_entity_1.Sessions),
        inject: ['DATA_SOURCE'],
    },
];
//# sourceMappingURL=session.providers.js.map