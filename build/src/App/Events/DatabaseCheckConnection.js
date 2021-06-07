"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Events_1 = tslib_1.__importDefault(require("../Events"));
const _Connection_1 = require("../Models/_Connection");
class DatabaseCheckConnection extends Events_1.default {
    constructor() {
        super('ready');
    }
    run(_client, _message) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            _Connection_1.checkConnection()
                .then(() => console.log('Handshaking with SQLite successfully!'))
                .catch(err => { throw err; });
        });
    }
}
exports.default = DatabaseCheckConnection;
//# sourceMappingURL=DatabaseCheckConnection.js.map