"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Command_1 = tslib_1.__importDefault(require("../../Command"));
class SetGamePresence extends Command_1.default {
    constructor() {
        super({
            name: 'setpresence',
            description: 'Set presence.',
            args: [
                { name: 'message', type: 'BLOCK', require: false }
            ],
            example: 'setpresence Halo semua',
            ownerOnly: true
        });
    }
    run(client, message, args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const msg = args.join(' ');
            if (!msg) {
                client.state.presence.status = true;
                message.reply('presence successfully reset!');
            }
            else {
                client.state.presence.status = false;
                client.user.setPresence({
                    activity: {
                        name: msg,
                        type: 'PLAYING'
                    }
                });
                message.reply('presence has been successfully set!');
            }
        });
    }
}
exports.default = SetGamePresence;
//# sourceMappingURL=SetGamePresence.js.map