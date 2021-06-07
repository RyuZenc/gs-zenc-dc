"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Command_1 = tslib_1.__importDefault(require("../../Command"));
const _Connection_1 = require("../../Models/_Connection");
class Ping extends Command_1.default {
    constructor() {
        super({
            name: ['ping', 'p'],
            description: 'Ping'
        });
    }
    getDatabaseLatency() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const now = Date.now();
            yield _Connection_1.checkConnection();
            return Date.now() - now;
        });
    }
    run(client, message, _args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const now = Date.now();
            message.channel.send(':ping_pong: Tunggu sebentar...')
                .then((message) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (!message)
                    return;
                const diff = Date.now() - now;
                yield message.edit(`:ping_pong: Pong!\nLatency: ${diff} ms\nWebSocket: ${client.ws.ping} ms\nDatabase: ${yield this.getDatabaseLatency()} ms`);
            }));
        });
    }
}
exports.default = Ping;
//# sourceMappingURL=Ping.js.map