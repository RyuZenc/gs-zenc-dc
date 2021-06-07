"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Command_1 = tslib_1.__importDefault(require("../../Command"));
const WarnList_1 = tslib_1.__importDefault(require("../../Models/WarnList"));
const StaffList_1 = require("../../Module/Moderation/StaffList");
class WarnDelete extends Command_1.default {
    constructor() {
        super({
            name: 'warndelete',
            description: 'Hapus warnlistnya.',
            args: [
                { name: 'userID|mention', require: false, type: 'BLOCK' }
            ],
            example: 'warnlist 709668494563868695'
        });
    }
    run(client, message, args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const _member = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.author;
            const member = message.guild.members.cache.get(_member.id);
            const momod = yield message.guild.members.fetch(message.author.id);
            const ifStaff = yield StaffList_1.ifStaff(momod);
            if (!ifStaff) {
                if (!momod.hasPermission('ADMINISTRATOR')) {
                    return message.reply('anda tidak memiliki ijin untuk menggunakan command ini!');
                }
            }
            WarnList_1.default.destroy({
                where: {
                    serverID: member.guild.id,
                    memberID: member.id
                }
            })
                .then(data => {
                if (data) {
                    message.reply(`warn untuk <@!${member.id}> berhasil dihapus!`);
                }
                else {
                    message.reply(`warn untuk <@!${member.id}> masih kosong!`);
                }
            })
                .catch(err => {
                message.reply(client.constant.errReason(err));
            });
        });
    }
}
exports.default = WarnDelete;
//# sourceMappingURL=WarnDelete.js.map