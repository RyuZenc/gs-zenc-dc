"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Events_1 = tslib_1.__importDefault(require("../Events"));
class EngineReady extends Events_1.default {
    constructor() {
        super('ready');
    }
    run(client) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log('Gateway opened!');
            if (process.env.PRODUCTION === 'DEV') {
                console.log(client.command);
                console.log(client.help);
            }
        });
    }
}
exports.default = EngineReady;
//# sourceMappingURL=EngineReady.js.map