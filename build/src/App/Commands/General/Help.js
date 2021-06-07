"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const Command_1 = tslib_1.__importDefault(require("../../Command"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const ArgsToString_1 = tslib_1.__importDefault(require("../../Module/Command/ArgsToString"));
class Help extends Command_1.default {
    constructor() {
        super({
            name: 'help',
            description: 'List of the command in here',
            args: [
                { name: 'command', require: false, type: 'BLOCK' }
            ],
            example: 'help ping'
        });
    }
    run(client, message, args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const command = args[0];
            const cmd = client.command;
            const help = client.help;
            const embed = new discord_js_1.MessageEmbed()
                .setTimestamp()
                .setColor(client.config.botColor)
                .setFooter(`(C) ${moment_1.default().format('YYYY')} - ${client.config.botName} | Running ${cmd.size} command${cmd.size > 1 ? 's' : ''}`, client.user.displayAvatarURL())
                .setThumbnail(client.user.displayAvatarURL());
            if (!command || command.length === 0) {
                embed
                    .setTitle(`${client.config.botName} Command List`)
                    .setDescription(`Untuk mengecek perintah command, silahkan ketik: \n\`\`\`${client.config.botPrefix}help <command>\`\`\`\n` +
                    'Untuk catatan, penggunaan argumen untuk bot ini:\n' +
                    `\`${client.config.botPrefix}com [args]\` **>>** Argumen command ini hanya bersifat opsional.\n` +
                    `\`${client.config.botPrefix}com <args>\` **>>** Argumen command ini bersifat wajib.\n` +
                    `\`${client.config.botPrefix}com [menu|m]\` **>>** Kamu bisa memilih di antara argumen yang telah diberi.`);
                help.forEach(category => {
                    if (!category.module.hidden) {
                        const cmdList = category.command.map(cate => cate.split(':')[1]);
                        embed.addField(category.module.name, `\`${cmdList.join('` `')}\``);
                    }
                });
            }
            else {
                const getCmd = cmd.get(command);
                if (!getCmd)
                    return client.constant.usage(message, this.options.name, this.options.args);
                const args = typeof getCmd.options.name !== 'string'
                    ? getCmd.options.name.slice(1)
                    : [];
                embed
                    .setAuthor(`Penggunaan Command ${client.config.botPrefix}${command}.`)
                    .addField('Deskripsi', getCmd.options.description)
                    .addField('Alias', args.length === 0 ? 'Tidak ada alias.' : `${client.config.botPrefix}${args.join(`, ${client.config.botPrefix}`)}`)
                    .addField('Penggunaan', `${client.config.botPrefix}${command}${typeof getCmd.options.args === 'undefined' ? '' : ` ${ArgsToString_1.default(getCmd.options.args)}`}`)
                    .addField('Contoh', `${client.config.botPrefix}${!getCmd.options.example ? command : getCmd.options.example}`);
            }
            message.channel.send(`<@!${message.author.id}>`, { embed: embed });
        });
    }
}
exports.default = Help;
//# sourceMappingURL=Help.js.map