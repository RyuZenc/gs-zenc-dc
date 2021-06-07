"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const Command_1 = tslib_1.__importDefault(require("../../Command"));
const StaffList_1 = tslib_1.__importDefault(require("../../Models/StaffList"));
class ListStaff extends Command_1.default {
    constructor() {
        super({
            name: 'liststaff',
            description: 'Daftar role staff di server ini.'
        });
    }
    run(client, message, _args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const guildID = message.guild.id;
            const data = yield StaffList_1.default.findAll({ where: { serverID: guildID } });
            let count = 1;
            const returningData = [];
            data.forEach(da => {
                returningData.push(`${count}. <@&${da.roleID}>`);
                count++;
            });
            const embed = new discord_js_1.MessageEmbed()
                .setColor(client.config.botColor)
                .setTitle('Daftar Role Staff')
                .setFooter(`Diminta oleh ${message.author.tag}`, message.author.displayAvatarURL())
                .setTimestamp()
                .setDescription(returningData.length > 0 ? returningData.join('\n') : 'Tidak ada role.');
            yield message.channel.send(`<@!${message.author.id}>`, { embed: embed });
        });
    }
}
exports.default = ListStaff;
//# sourceMappingURL=ListStaff.js.map