"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const Command_1 = tslib_1.__importDefault(require("../../Command"));
class PunishmentList extends Command_1.default {
    constructor() {
        super({
            name: 'listpunishment',
            description: 'Daftar Punishment yang mungkin kalian tidak tau di server ini.',
            args: [
                { name: 'menu', require: false, type: 'BLOCK' }
            ],
            example: 'listpunishment warn'
        });
        this.menu = {
            warn: {
                description: 'Hukuman ini kamu dapatkan dikarenakan melanggar suatu peraturan/mengganggu member lain di server ini.',
                whyGetPunishment: 'Diberikan oleh staff secara langsung atau dari laporan member.',
                counting: [
                    { counter: 3, fallback: '3 jam mute/bungkam' },
                    { counter: 4, fallback: '1 hari mute/bungkam' },
                    { counter: 5, fallback: 'Kick/tendang' },
                    { counter: 7, fallback: 'Banned' },
                    { counter: 9, fallback: 'Banned' }
                ]
            },
            badword: {
                description: 'Hukuman ini kamu dapatkan dikarenakan memakai badword yang berlebihan.',
                whyGetPunishment: 'Autowarn.',
                counting: [
                    { counter: 3, fallback: '1 jam mute/bungkam' },
                    { counter: 5, fallback: '5 jam mute/bungkam' },
                    { counter: 7, fallback: '12 jam mute/bungkam' },
                    { counter: 9, fallback: '1 hari mute/bungkam' },
                    { counter: 10, fallback: '3 hari mute/bungkam dan seterusnya' },
                ]
            },
            invite: {
                description: 'Hukuman ini kamu dapatkan dikarenakan mengirimkan Discord Invite Link.',
                whyGetPunishment: 'Anti Discord Link.',
                counting: [
                    { counter: 1, fallback: '2 jam mute/bungkam dan seterusnya' }
                ]
            }
        };
    }
    run(client, message, args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const plMenu = args[0];
            const categoryMenu = Object.keys(this.menu);
            const embed = new discord_js_1.MessageEmbed()
                .setColor(client.config.botColor)
                .setTimestamp()
                .setFooter(`Diminta oleh ${message.author.tag}`, message.author.displayAvatarURL())
                .setThumbnail(client.user.displayAvatarURL());
            if (!plMenu) {
                embed
                    .setTitle('Librari Punishment/Hukuman')
                    .setDescription(`Librari ini berisi bagaimana efek dari sebuah hukuman di server ini, silahkan memilih menu di bawah ini dengan cara \`${client.config.botPrefix}${this.options.name} [menu]\`.`)
                    .addField('Menu', `\`${categoryMenu.join('`, `')}\``, false);
            }
            else {
                const menu = plMenu.toLowerCase();
                if (!categoryMenu.includes(menu))
                    return message.reply('menu tidak valid.');
                const list = this.menu[menu];
                embed
                    .setTitle(`Deskripsi hukuman untuk ${menu}`)
                    .setDescription(list.description)
                    .addField('Mengapa kamu mendapatkannya', list.whyGetPunishment, false)
                    .addField('Hitungannya', list.counting.map(c => `Ke-${c.counter}: ${c.fallback}`).join('\n'), false);
            }
            message.channel.send(`<@!${message.author.id}>`, { embed });
        });
    }
}
exports.default = PunishmentList;
//# sourceMappingURL=PunishmentList.js.map