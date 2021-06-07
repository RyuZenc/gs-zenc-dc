"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Events_1 = tslib_1.__importDefault(require("../Events"));
const TempMute_1 = require("../Module/Moderation/TempMute");
const StaffList_1 = require("../Module/Moderation/StaffList");
class ModerationAntiInvite extends Events_1.default {
    constructor() {
        super('message');
    }
    run(client, message) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (message.channel.type !== 'text')
                return;
            if (message.author.bot)
                return;
            const executor = yield message.guild.members.fetch(message.author.id);
            if (!executor)
                return;
            const server = client.state.antiInvite.get(message.guild.id);
            if (!server)
                return;
            let ifImmune = false;
            server.forEach(se => {
                if (executor.roles.cache.has(se))
                    ifImmune = true;
            });
            if (ifImmune)
                return;
            if (executor.permissions.has('ADMINISTRATOR'))
                return;
            if (yield StaffList_1.ifStaff(executor))
                return;
            const content = message.content;
            const matcher = content.match(/(https?:\/\/)?(http?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/igm);
            if (matcher) {
                const _role = message.guild.roles.cache.filter(r => r.name === 'Muted');
                if (_role.size > 0) {
                    const role = _role.first();
                    yield TempMute_1.setTempMute(client, executor, role, '2h', 'Server advertisment');
                }
                yield message.delete();
                yield message.reply('anda telah dibungkam selama 2 jam dengan alasan:\n```[AutoWarn] Tidak boleh promosi server Discord di sini!```');
            }
        });
    }
}
exports.default = ModerationAntiInvite;
//# sourceMappingURL=ModerationAntiInvite.js.map