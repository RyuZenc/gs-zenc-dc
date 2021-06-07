"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const Command_1 = tslib_1.__importDefault(require("../../Command"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const WarnList_1 = tslib_1.__importDefault(require("../../Models/WarnList"));
const BadwordVictim_1 = tslib_1.__importDefault(require("../../Models/BadwordVictim"));
class WarnList extends Command_1.default {
    constructor() {
        super({
            name: 'warnlist',
            description: 'Daftar warn member.',
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
            const WarnList = yield WarnList_1.default.findAll({
                where: { serverID: message.guild.id, memberID: member.id }
            });
            const BadwordVictim = yield BadwordVictim_1.default.findAll({
                where: { serverID: message.guild.id, memberID: member.id }
            });
            const embed = new discord_js_1.MessageEmbed()
                .setColor(client.config.botColor)
                .setTimestamp()
                .setFooter(`Diminta oleh ${message.author.tag}`, message.author.displayAvatarURL())
                .setTitle(`Daftar Warn untuk ${member.user.tag}`);
            let warnStr = '';
            let count = 1;
            WarnList.forEach(wlist => {
                warnStr += `${count}. ${wlist.reason} | <@!${wlist.staffID}> [${moment_1.default(wlist.dateExecuted).utcOffset('+08:00').format('YYYY-MM-DD HH:mm:ss')} WITA]\n`;
                count++;
            });
            let bwStr = '';
            count = 1;
            BadwordVictim.forEach(badword => {
                bwStr += `${count}. **${badword.badword}** [${moment_1.default(badword.timestamp).utcOffset('+08:00').format('YYYY-MM-DD HH:mm:ss')} WITA]\n`;
                count++;
            });
            embed
                .addField('Warn/Pelanggaran', warnStr.length === 0 ? 'Masih kosong' : warnStr)
                .addField('Badword', bwStr.length === 0 ? 'Masih kosong' : bwStr);
            yield message.channel.send(`<@!${message.author.id}>`, { embed });
        });
    }
}
exports.default = WarnList;
//# sourceMappingURL=WarnList.js.map