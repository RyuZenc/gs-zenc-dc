"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Events_1 = tslib_1.__importDefault(require("../Events"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const BadwordVictim_1 = tslib_1.__importDefault(require("../Models/BadwordVictim"));
const StaffList_1 = require("../Module/Moderation/StaffList");
const TempMute_1 = require("../Module/Moderation/TempMute");
class ModerationBadword extends Events_1.default {
    constructor() {
        super('message');
    }
    run(client, message) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (message.channel.type !== 'text')
                return;
            if (message.author.bot)
                return;
            if (message.author.id === client.user.id)
                return;
            if (client.config.owner.includes(message.author.id))
                return;
            const executor = yield message.guild.members.fetch(message.author.id);
            if (!executor)
                return;
            const server = client.state.badword.get(message.guild.id);
            if (!server)
                return;
            let ifImmune = false;
            server.immune.forEach(se => {
                if (executor.roles.cache.has(se))
                    ifImmune = true;
            });
            if (ifImmune)
                return;
            if (executor.permissions.has('ADMINISTRATOR'))
                return;
            if (yield StaffList_1.ifStaff(executor))
                return;
            const matcher = server.list.getBadword(message.content);
            if (matcher.length > 0) {
                yield message.delete();
                yield BadwordVictim_1.default.create({
                    serverID: message.guild.id,
                    channelID: message.channel.id,
                    memberID: message.author.id,
                    badword: matcher.join(' | '),
                    timestamp: moment_1.default().format()
                });
                const _counter = yield BadwordVictim_1.default.findAll({
                    where: {
                        serverID: message.guild.id,
                        channelID: message.channel.id,
                        memberID: message.author.id
                    }
                });
                const counter = _counter.length;
                const role = message.guild.roles.cache.filter(r => r.name === 'Muted').first();
                if (!role)
                    return;
                switch (counter) {
                    case 3:
                        TempMute_1.setTempMute(client, executor, role, '1h', 'Badword')
                            .then(res => {
                            if (res)
                                message.reply(`<@!${executor.id}> berhasil dibungkam selama ${res.intTime} ${res.prettyTime} dengan alasan:\`\`\`[AutoWarn] Badword\`\`\``);
                        })
                            .catch(err => {
                            message.reply(client.constant.errReason(err));
                        });
                        break;
                    case 5:
                        TempMute_1.setTempMute(client, executor, role, '5h', 'Badword')
                            .then(res => {
                            if (res)
                                message.reply(`<@!${executor.id}> berhasil dibungkam selama ${res.intTime} ${res.prettyTime} dengan alasan:\`\`\`[AutoWarn] Badword\`\`\``);
                        })
                            .catch(err => {
                            message.reply(client.constant.errReason(err));
                        });
                        break;
                    case 7:
                        TempMute_1.setTempMute(client, executor, role, '12h', 'Badword')
                            .then(res => {
                            if (res)
                                message.reply(`<@!${executor.id}> berhasil dibungkam selama ${res.intTime} ${res.prettyTime} dengan alasan:\`\`\`[AutoWarn] Badword\`\`\``);
                        })
                            .catch(err => {
                            message.reply(client.constant.errReason(err));
                        });
                        break;
                    case 9:
                        TempMute_1.setTempMute(client, executor, role, '1d', 'Badword')
                            .then(res => {
                            if (res)
                                message.reply(`<@!${executor.id}> berhasil dibungkam selama ${res.intTime} ${res.prettyTime} dengan alasan:\`\`\`[AutoWarn] Badword\`\`\``);
                        })
                            .catch(err => {
                            message.reply(client.constant.errReason(err));
                        });
                        break;
                    case 10:
                        TempMute_1.setTempMute(client, executor, role, '3d', 'Badword')
                            .then(res => {
                            if (res)
                                message.reply(`<@!${executor.id}> berhasil dibungkam selama ${res.intTime} ${res.prettyTime} dengan alasan:\`\`\`[AutoWarn] Badword\`\`\``);
                        })
                            .catch(err => {
                            message.reply(client.constant.errReason(err));
                        });
                        break;
                }
                yield message.reply(`kamu diwarn dengan alasan:\n\`\`\`[AutoWarn] Badword ke-${counter}. Tanyakan pada temanmu/staff tentang kesalahanmu di gs!warnlist @mention\`\`\``);
            }
        });
    }
}
exports.default = ModerationBadword;
//# sourceMappingURL=ModerationBadword.js.map