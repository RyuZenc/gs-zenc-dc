"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Events_1 = tslib_1.__importDefault(require("../Events"));
class EngineStatusGame extends Events_1.default {
    constructor() {
        super('ready');
    }
    run(client) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            setInterval(() => {
                const state = client.state;
                if (state.presence.status) {
                    const msg = state.presence.message[Math.floor(Math.random() * state.presence.message.length)];
                    client.user.setPresence({
                        activity: {
                            name: `${client.config.botPrefix}help | ${msg}`,
                            type: 'PLAYING'
                        }
                    });
                }
            }, client.state.presence.interval);
        });
    }
}
exports.default = EngineStatusGame;
//# sourceMappingURL=EngineStatusGame.js.map