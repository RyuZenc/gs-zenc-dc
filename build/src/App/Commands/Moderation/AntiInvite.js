"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const Command_1 = tslib_1.__importDefault(require("../../Command"));
const AntiInviteServer_1 = tslib_1.__importDefault(require("../../Models/AntiInviteServer"));
const AntiInviteImmune_1 = tslib_1.__importDefault(require("../../Models/AntiInviteImmune"));
const StaffList_1 = require("../../Module/Moderation/StaffList");
class AntiInvite extends Command_1.default {
    constructor() {
        super({
            name: 'antiinvite',
            description: 'Kelola anti invite di server ini.',
            args: [
                { name: 'toggle|immune', require: false, type: 'BLOCK' },
                { name: 'immune=roleID|roleMention', require: false, type: 'BLOCK' }
            ],
            example: 'antiinvite toggle'
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
            const getState = client.state.antiInvite.has(message.guild.id);
            if (!toggle) {
                embed
                    .setTitle('Status Anti Invite')
                    .setDescription(`Anda ${!getState ? 'belum' : 'sudah'} menyalakan anti invite di server ini.`);
            }
            else {
                if (toggle === 'toggle') {
                    embed.setTitle('Toggle Anti Invite');
                    if (!getState) {
                        client.state.antiInvite.set(message.guild.id, []);
                        embed.setDescription('Anti invite berhasil diaktifkan!');
                        yield AntiInviteServer_1.default.create({
                            serverID: message.guild.id
                        });
                    }
                    else {
                        client.state.antiInvite.delete(message.guild.id);
                        embed.setDescription('Anti invite berhasil dinonaktifkan!');
                        yield AntiInviteServer_1.default.destroy({
                            where: { serverID: message.guild.id }
                        });
                    }
                }
                if (toggle === 'immune') {
                    const server = client.state.antiInvite.get(message.guild.id);
                    if (!server)
                        return message.reply('anti invite di server ini belum dinyalakan!');
                    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
                    if (!role) {
                        const ghostMap = server.map(val => {
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
                        const immuneToggle = server.includes(role.id);
                        if (!immuneToggle) {
                            server.push(role.id);
                            embed.setDescription(`Role untuk <@&${role.id}> berhasil ditambahkan ke dalam immune.`);
                            yield AntiInviteImmune_1.default.create({
                                serverID: message.guild.id,
                                roleID: role.id
                            });
                        }
                        else {
                            server.splice(server.indexOf(message.guild.id), 1);
                            embed.setDescription(`Role untuk <@&${role.id}> berhasil dihapus ke dalam immune.`);
                            yield AntiInviteImmune_1.default.destroy({
                                where: {
                                    serverID: message.guild.id,
                                    roleID: role.id
                                }
                            });
                        }
                    }
                }
                if (!['toggle', 'immune'].includes(toggle)) {
                    return message.reply('inputan tidak valid!');
                }
            }
            yield message.channel.send(`<@!${message.author.id}>`, { embed });
        });
    }
}
exports.default = AntiInvite;
//# sourceMappingURL=AntiInvite.js.map