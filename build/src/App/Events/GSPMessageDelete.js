"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Events_1 = tslib_1.__importDefault(require("../Events"));
const discord_js_1 = require("discord.js");
class GSPMessageDelete extends Events_1.default {
    constructor() {
        super('messageDelete');
    }
    run(client, message) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (message.channel.type !== 'text')
                return;
            if (message.author.bot)
                return;
            if (message.guild.id !== '302655971946135554')
                return;
            const guild = client.guilds.cache.get('302655971946135554');
            if (!guild)
                return;
            const channel = guild.channels.cache.get('714821103360409631');
            if (!channel)
                return;
            if (channel.type !== 'text')
                return;
            const embed = new discord_js_1.MessageEmbed()
                .setAuthor(`${message.author.tag} [${message.author.id}]`, message.author.displayAvatarURL())
                .addField('Channel', `<#${message.channel.id}>`, false)
                .addField('Content', message.content.length > 0 ? message.content : 'Tidak ada konten', false)
                .setTimestamp();
            const mentioned = [];
            message.mentions.members.forEach(men => mentioned.push(`<@!${men.id}>`));
            message.mentions.roles.forEach(men => mentioned.push(`<@&${men.id}>`));
            channel.send(mentioned.length > 0 ? `Mentioned: ${mentioned.join(' | ')}` : '', { embed });
        });
    }
}
exports.default = GSPMessageDelete;
//# sourceMappingURL=GSPMessageDelete.js.map