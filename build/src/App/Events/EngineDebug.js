"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Events_1 = tslib_1.__importDefault(require("../Events"));
class EngineDebug extends Events_1.default {
    constructor() {
        super('debug');
    }
    run(_client, message) {
        if (process.env.PRODUCTION === 'DEV') {
            console.log(message);
        }
    }
}
exports.default = EngineDebug;
//# sourceMappingURL=EngineDebug.js.map