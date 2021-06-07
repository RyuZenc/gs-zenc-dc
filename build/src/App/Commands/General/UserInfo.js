"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const Command_1 = tslib_1.__importDefault(require("../../Command"));
const moment_1 = tslib_1.__importDefault(require("moment"));
class UserInfo extends Command_1.default {
    constructor() {
        super({
            name: ['userinfo', 'uinfo'],
            description: 'Liat informasi dari user yang dituju/user kamu.',
            args: [
                { name: 'uID|mention', require: true, type: 'BLOCK' }
            ],
            example: 'userinfo <@!709668494563868695>'
        });
    }
    setColorPresence(presence) {
        const ret = { color: '', pretty: '' };
        switch (presence) {
            case 'online':
                ret.color = '0x00ff00';
                ret.pretty = 'Online';
                break;
            case 'offline':
                ret.color = '0x858585';
                ret.pretty = 'Offline';
                break;
            case 'idle':
                ret.color = '0xffff00';
                ret.pretty = 'AFK';
                break;
            case 'dnd':
                ret.color = '0xff0000';
                ret.pretty = 'Sibuk';
                break;
        }
        return ret;
    }
    run(client, message, args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.author;
            if (!user)
                return client.constant.usage(message, this.options.name, this.options.args);
            const member = message.guild.members.cache.get(user.id);
            if (!member)
                return message.reply('member tidak ditemukan!');
            const embed = new discord_js_1.MessageEmbed()
                .setColor(this.setColorPresence(member.user.presence.status).color)
                .setTimestamp()
                .setFooter(`Direquest oleh ${message.author.tag}`, client.user.displayAvatarURL())
                .setThumbnail(member.user.displayAvatarURL())
                .setTitle(`${member.user.tag} [${member.id}]`)
                .addFields([
                {
                    name: 'Panggilan',
                    value: member.nickname || 'Tidak ada panggilan',
                    inline: false
                },
                {
                    name: 'Status',
                    value: `${this.setColorPresence(member.user.presence.status).pretty}` +
                        `${typeof member.voice.channelID === 'undefined' ? '' : ` (Sedang ngobrol di ${!member.voice.channel ? 'server lain.' : member.voice.channel.name})`}`,
                    inline: true
                },
                {
                    name: 'Role Tertinggi',
                    value: `<@&${member.roles.highest.id}>`,
                    inline: true
                },
                {
                    name: 'Akun Dibuat',
                    value: moment_1.default(member.user.createdAt).utcOffset('+08:00').format('dddd, DD MMMM YYYY (HH:mm:ss [WITA])'),
                    inline: false
                },
                {
                    name: `Masuk di ${message.guild.name}`,
                    value: moment_1.default(member.joinedAt).utcOffset('+08:00').format('dddd, DD MMMM YYYY (HH:mm:ss [WITA])'),
                    inline: false
                }
            ]);
            message.channel.send(`<@!${message.author.id}>`, { embed });
        });
    }
}
exports.default = UserInfo;
//# sourceMappingURL=UserInfo.js.map