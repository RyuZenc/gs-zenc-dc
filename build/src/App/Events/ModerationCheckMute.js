"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Events_1 = tslib_1.__importDefault(require("../Events"));
const TempMute_1 = tslib_1.__importDefault(require("../Models/TempMute"));
const moment_1 = tslib_1.__importDefault(require("moment"));
class ModerationCheckMute extends Events_1.default {
    constructor() {
        super('ready');
    }
    run(client) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            setInterval(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                client.state.tempMute.forEach((value, key) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const now = moment_1.default();
                    const keys = key.split(':');
                    const serverID = keys[0];
                    const memberID = keys[1];
                    const guild = client.guilds.cache.filter(g => g.id === serverID).first();
                    if (!guild)
                        return;
                    const member = guild.members.cache.filter(m => m.id === memberID).first();
                    if (!member)
                        return;
                    const role = guild.roles.cache.filter(r => r.name === 'Muted').first();
                    if (!role)
                        return;
                    if (now.diff(value, 's') > 0) {
                        if (member.roles.cache.has(role.id)) {
                            yield member.roles.remove(role);
                        }
                        yield TempMute_1.default.update({ executed: true }, {
                            where: { serverID, memberID, executed: false }
                        });
                        client.state.tempMute.delete(key);
                    }
                }));
            }), 1000);
        });
    }
}
exports.default = ModerationCheckMute;
//# sourceMappingURL=ModerationCheckMute.js.map