"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Command_1 = tslib_1.__importDefault(require("../../Command"));
const StaffList_1 = require("../../Module/Moderation/StaffList");
class Ban extends Command_1.default {
    constructor() {
        super({
            name: 'ban',
            description: 'Ban user.',
            args: [
                { name: 'userID|mention', require: true, type: 'BLOCK' },
                { name: 'reason', require: false, type: 'BLOCK' }
            ],
            example: 'ban 709668494563868695 harrass'
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
            const ifMemberStaff = yield StaffList_1.ifStaff(member);
            if (ifMemberStaff || member.hasPermission('ADMINISTRATOR'))
                return message.reply('anda tidak bisa memalu staff.');
            yield member.createDM()
                .then(memberCH => {
                memberCH.send(`Anda telah dipalu dari ${message.guild.name} dengan alasan:\n\`\`\`${reason}\`\`\``);
            })
                .catch(_err => {
            });
            yield member.ban({ reason: `${rlReason} | ${message.author.tag}` })
                .then(() => {
                message.reply(`member tersebut berhasil dipalu dengan alasan:\n\`\`\`${rlReason}\`\`\``);
            })
                .catch(err => {
                message.reply(client.constant.errReason(err));
            });
        });
    }
}
exports.default = Ban;
//# sourceMappingURL=Ban.js.map