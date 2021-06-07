"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const Command_1 = tslib_1.__importDefault(require("../../Command"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const EventCommitee_1 = require("../../Module/GSP/EventCommitee");
const StaffList_1 = require("../../Module/Moderation/StaffList");
class GesperCore extends Command_1.default {
    constructor() {
        super({
            name: 'gesper',
            description: 'Gesper Core',
            args: [
                { name: 'command', require: false, type: 'BLOCK' },
                { name: '...args', require: false, type: 'BLOCK' }
            ],
            example: 'gesper'
        });
    }
    startGesperCore(client, message) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield message.channel.send(`Penanggung jawab kali ini adalah <@!${message.author.id}>\nKetik \`cancel\` apabila ingin membatalkan konfigurasi ini.`);
            const embedBuilder = new discord_js_1.MessageEmbed()
                .setColor(client.config.botColor)
                .setTitle('Konfigurasi GESPER')
                .setDescription('Sebutkan channel yang ingin kamu gunakan untuk GESPER kali ini!');
            try {
                const messageDominator = yield message.channel.send(embedBuilder);
                const config = {
                    channelID: '',
                    serverID: '',
                    executor: '',
                    break: false
                };
                yield message.channel.awaitMessages((m) => {
                    return (m.content.toLowerCase() === 'cancel' || (m.content.startsWith('<#') && m.content.endsWith('>'))
                        || message.guild.channels.cache.has(m.content))
                        && m.author.id === message.author.id;
                }, {
                    time: 30000,
                    max: 1,
                    errors: ['time']
                })
                    .then((collected) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const data = collected.first();
                    yield data.delete();
                    config.break = data.content.toLowerCase() === 'cancel' ? true : false;
                    config.channelID = data.content.toLowerCase() !== 'cancel' ? data.content.match(/\d+/)[0] : '';
                    config.serverID = message.guild.id;
                    config.executor = data.author.id;
                    console.log(config);
                }))
                    .catch(_err => {
                    message.channel.send('Waktu habis!');
                });
                if (config.break) {
                    embedBuilder.setDescription('Konfigurasi dibatalkan');
                    yield messageDominator.edit(embedBuilder);
                    return undefined;
                }
                embedBuilder.setDescription('Sedang mengambil beberapa plugin...');
                yield messageDominator.edit(embedBuilder);
                embedBuilder.setDescription(`
        Anda telah memilih <#${config.channelID}> sebagai tempat acara.
        Silahkan menggunakan \`${client.config.botPrefix}gesper stop\` untuk menghentikan acara.
        `);
                yield messageDominator.edit(embedBuilder);
                client.state.gesper.started = true;
                client.state.gesper.personInCharge = config.executor;
                client.state.gesper.whenStarted = moment_1.default();
                client.state.gesper.serverID = config.serverID;
                client.state.gesper.channelID = config.channelID;
            }
            catch (error) {
                message.reply(client.constant.errReason(error));
            }
        });
    }
    run(client, message, args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const executor = yield message.guild.members.fetch(message.author.id);
            if (!(yield EventCommitee_1.ifEventCommitee(executor)) || !(yield StaffList_1.ifStaff(executor))) {
                if (!executor.hasPermission('ADMINISTRATOR'))
                    return message.reply('hanya EVENT COMMITEE yang berhak untuk mengeksekusi command ini!');
            }
            if (args.length === 0) {
                if (client.state.gesper.started)
                    return message.channel.send(`GESPER sudah dimulai di <#${client.state.gesper.channelID}> oleh <@!${client.state.gesper.personInCharge}>.`);
                else {
                    this.startGesperCore(client, message);
                }
            }
        });
    }
}
exports.default = GesperCore;
//# sourceMappingURL=GesperCore.js.map