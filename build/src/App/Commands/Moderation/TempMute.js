"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Command_1 = tslib_1.__importDefault(require("../../Command"));
const StaffList_1 = require("../../Module/Moderation/StaffList");
const TempMute_1 = require("../../Module/Moderation/TempMute");
class TempMute extends Command_1.default {
    constructor() {
        super({
            name: ['tempmute', 'tmute'],
            description: 'Mute user dalam waktu yang ditentukan.',
            args: [
                { name: 'userID|mention', require: true, type: 'BLOCK' },
                { name: 'xd|xh|xm|xs', require: true, type: 'BLOCK' },
                { name: 'reason', require: false, type: 'BLOCK' }
            ],
            example: 'mute 709668494563868695 3h harrass'
        });
    }
    run(client, message, args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            const momod = yield message.guild.members.fetch(message.author.id);
            const reason = args.slice(2).join(' ');
            const plainTime = args[1];
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
            if (!TempMute_1.isTimeValid(plainTime))
                return message.reply('waktu yang anda berikan tidak valid.');
            TempMute_1.setTempMute(client, member, mutedRole, plainTime, rlReason)
                .then(res => {
                if (res)
                    message.reply(`<@!${member.id}> berhasil dibungkam selama ${res.intTime} ${res.prettyTime} dengan alasan:\`\`\`${rlReason}\`\`\``);
            })
                .catch(err => {
                message.reply(client.constant.errReason(err));
            });
        });
    }
}
exports.default = TempMute;
//# sourceMappingURL=TempMute.js.map