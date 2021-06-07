"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const Command_1 = tslib_1.__importDefault(require("../../Command"));
const axios_1 = tslib_1.__importDefault(require("axios"));
const moment_1 = tslib_1.__importDefault(require("moment"));
class BotInfo extends Command_1.default {
    constructor() {
        super({
            name: 'botinfo',
            description: 'Berisi informasi tentang bot.'
        });
    }
    run(client, message, _args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const pkgs = yield axios_1.default.get('https://raw.githubusercontent.com/skymunn/gsp-bot/master/package.json');
            if (!pkgs)
                return message.reply('tanyakan kepada staff tentang error ini:\n```Link Package hilang.```');
            const data = pkgs.data;
            const uptime = moment_1.default().diff(client.state.uptime);
            const embed = new discord_js_1.MessageEmbed()
                .setColor(client.config.botColor)
                .setTimestamp()
                .setFooter('https://github.com/skymunn/gsp-bot', client.user.displayAvatarURL())
                .setThumbnail(client.user.displayAvatarURL())
                .setTitle(`Statistik ${client.config.botName}`)
                .addFields([
                {
                    name: 'Mesin Perang',
                    value: `NodeJS ${data.engines.node}\nTypescript ${data.devDependencies.typescript}\nDiscordJS ${data.devDependencies['discord.js']}`,
                    inline: false
                },
                {
                    name: 'Versi Bot',
                    value: data.version,
                    inline: true
                },
                {
                    name: 'Lisensi Bot',
                    value: data.license,
                    inline: true
                },
                {
                    name: 'Pembuat',
                    value: client.config.owner.map(v => `<@!${v}>`).join(' '),
                    inline: false
                },
                {
                    name: 'Uptime',
                    value: moment_1.default.duration(uptime, 'millisecond').humanize(),
                    inline: false
                }
            ]);
            message.channel.send(`<@!${message.author.id}>`, { embed });
        });
    }
}
exports.default = BotInfo;
//# sourceMappingURL=BotInfo.js.map