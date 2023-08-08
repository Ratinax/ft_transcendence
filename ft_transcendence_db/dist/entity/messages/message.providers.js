"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageProviders = void 0;
const message_entity_1 = require("./message.entity");
exports.messageProviders = [
    {
        provide: 'MESSAGE_REPOSITORY',
        useFactory: (dataSource) => dataSource.getRepository(message_entity_1.Messages),
        inject: ['DATA_SOURCE'],
    },
];
//# sourceMappingURL=message.providers.js.map