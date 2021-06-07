"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Command_1 = tslib_1.__importDefault(require("../../Command"));
const TempMute_1 = tslib_1.__importDefault(require("../../Models/TempMute"));
const StaffList_1 = require("../../Module/Moderation/StaffList");
class Unmute extends Command_1.default {
    constructor() {
        super({
            name: 'unmute',
            description: 'Unmute user.',
            args: [
                { name: 'userID|mention', require: true, type: 'BLOCK' }
            ],
            example: 'unmute 709668494563868695'
        });
    }
    run(client, message, args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            const momod = yield message.guild.members.fetch(message.author.id);
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
            yield member.roles.remove(mutedRole);
            const keyTempMute = `${member.guild.id}:${member.id}`;
            if (client.state.tempMute.has(keyTempMute)) {
                yield TempMute_1.default.update({ executed: true }, {
                    where: { serverID: member.guild.id, memberID: member.id }
                });
                client.state.tempMute.delete(keyTempMute);
            }
            yield message.reply(`bungkaman untuk <@!${member.id}> telah dilepas!`);
        });
    }
}
exports.default = Unmute;
//# sourceMappingURL=Unmute.js.map