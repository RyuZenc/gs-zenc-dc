"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const Command_1 = tslib_1.__importDefault(require("../../Command"));
const StaffList_1 = require("../../Module/Moderation/StaffList");
const Badword_1 = tslib_1.__importDefault(require("../../Module/Moderation/Badword"));
const BadwordList_1 = tslib_1.__importDefault(require("../../Models/BadwordList"));
class Badword extends Command_1.default {
    constructor() {
        super({
            name: 'badword',
            description: 'Kelola anti invite di server ini.',
            args: [
                { name: 'modify|immune', require: false, type: 'BLOCK' },
                { name: 'modify=badword', require: false, type: 'BLOCK' },
                { name: 'immune=roleID|roleMention', require: false, type: 'BLOCK' }
            ],
            example: 'badword modify bego'
        });
    }
    run(client, message, args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const executor = yield message.guild.members.fetch(message.author.id);
            if (!executor)
                return;
            if (!executor.hasPermission('ADMINISTRATOR') && !client.config.owner.includes(executor.id)) {
                return message.reply('hanya ADMIN yang bisa mengeksekusi perintah ini.');
            }
            const embed = new discord_js_1.MessageEmbed()
                .setColor(client.config.botColor)
                .setFooter(`Diminta oleh ${message.author.tag}`, message.author.displayAvatarURL())
                .setTimestamp();
            const toggle = args[0];
            if (!toggle) {
                embed.setTitle(`Daftar Badword di ${message.guild.name}`);
                const list = client.state.badword.get(message.guild.id);
                if (!list) {
                    embed.setDescription('Masih kosong.');
                }
                else {
                    embed.setDescription(list.list.badword.length > 0
                        ? `\`${list.list.badword.join('`, `')}\``
                        : 'Masih kosong.');
                }
            }
            else {
                const _server = client.state.badword.get(message.guild.id);
                if (!_server)
                    client.state.badword.set(message.guild.id, {
                        immune: [], list: new Badword_1.default([])
                    });
                const server = client.state.badword.get(message.guild.id);
                if (toggle === 'modify') {
                    const _badword = args[1];
                    if (!_badword)
                        return client.constant.usage(message, this.options.name, this.options.args);
                    const badword = _badword.toLowerCase();
                    embed.setTitle('Modifikasi Badword');
                    if (!server.list.hasBadword(badword)) {
                        server.list.addBadowrd(badword);
                        embed.setDescription(`Badword "${badword}" berhasil ditambahkan!`);
                        yield BadwordList_1.default.create({
                            serverID: message.guild.id,
                            badword: badword,
                            memberID: message.author.id
                        });
                    }
                    else {
                        server.list.removeBadword(badword);
                        embed.setDescription(`Badword "${badword}" berhasil dihapus!`);
                        yield BadwordList_1.default.destroy({
                            where: {
                                serverID: message.guild.id,
                                badword: badword
                            }
                        });
                    }
                }
                if (toggle === 'immune') {
                    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
                    if (!role) {
                        const ghostMap = server.immune.map(val => {
                            const rl = message.guild.roles.cache.get(val);
                            return !rl ? 'Invalid role' : rl.name;
                        });
                        const stfList = yield StaffList_1.GetStaffList(message.guild.id);
                        stfList.forEach(val => {
                            const rl = message.guild.roles.cache.get(val);
                            ghostMap.push(`${!rl ? 'Invalid role' : rl.name} (from Staff)`);
                        });
                        embed
                            .setTitle('Daftar Role Immune')
                            .setDescription(ghostMap.length > 0 ? ghostMap.join(', ') : 'Masih kosong');
                    }
                    else {
                        embed.setTitle('Toggle Role Immune');
                        const immuneToggle = server.immune.includes(role.id);
                        if (!immuneToggle) {
                            server.immune.push(role.id);
                            embed.setDescription(`Role untuk <@&${role.id}> berhasil ditambahkan ke dalam immune.`);
                        }
                        else {
                            server.immune.splice(server.immune.indexOf(role.id), 1);
                            embed.setDescription(`Role untuk <@&${role.id}> berhasil dihapus ke dalam immune.`);
                        }
                    }
                }
                if (!['modify', 'immune'].includes(toggle)) {
                    return message.reply('inputan tidak valid!');
                }
            }
            yield message.channel.send(`<@!${message.author.id}>`, { embed });
        });
    }
}
exports.default = Badword;
//# sourceMappingURL=Badword.js.map