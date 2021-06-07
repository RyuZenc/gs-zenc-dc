"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Command_1 = tslib_1.__importDefault(require("../../Command"));
const StaffList_1 = require("../../Module/Moderation/StaffList");
class Mute extends Command_1.default {
    constructor() {
        super({
            name: 'mute',
            description: 'Mute user.',
            args: [
                { name: 'userID|mention', require: true, type: 'BLOCK' },
                { name: 'reason', require: false, type: 'BLOCK' }
            ],
            example: 'mute 709668494563868695 harrass'
        });
    }
    run(client, message, args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            const momod = yield message.guild.members.fetch(message.author.id);
            const reason = args.slice(1).join(' ');
            const rlReason = !reason || reason.length === 0 ? 'Tidak ada alasan' : reason;
            if (!member || !momod)
                return client.constant.usage(message, this.options.name, this.options.args);
            const ifStaff = yield StaffList_1.ifStaff(momod);
            if (!ifStaff) {
                if (!momod.hasPermission('ADMINISTRATOR')) {
                    return message.reply('anda tidak memiliki ijin untuk menggunakan command ini!');
                }
            }
            const mutedRole = message.guild.roles.cache.filter(r => r.name === 'Muted').first();
            if (!mutedRole)
                return message.reply('tidak ada role yang bernama **Muted**.');
            yield member.roles.add(mutedRole)
                .then(mem => {
                message.reply(`<@!${mem.id}> berhasil dibungkam dengan alasan:\`\`\`${rlReason}\`\`\``);
            })
                .catch(err => {
                message.reply(client.constant.errReason(err));
            });
        });
    }
}
exports.default = Mute;
//# sourceMappingURL=Mute.js.map