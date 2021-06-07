"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Command_1 = tslib_1.__importDefault(require("../../Command"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const WarnList_1 = tslib_1.__importDefault(require("../../Models/WarnList"));
const StaffList_1 = require("../../Module/Moderation/StaffList");
const TempMute_1 = require("../../Module/Moderation/TempMute");
class Warn extends Command_1.default {
    constructor() {
        super({
            name: 'warn',
            description: 'Beri peringatan kepada user.',
            args: [
                { name: 'userID|mention', require: true, type: 'BLOCK' },
                { name: 'reason', require: false, type: 'BLOCK' }
            ],
            example: 'warn 709668494563868695 harrass'
        });
    }
    run(client, message, args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            const momod = yield message.guild.members.fetch(message.author.id);
            const reason = args.slice(1).join(' ');
            const rlReason = !reason || reason.length === 0 ? 'Tidak ada alasan' : reason;
            if (!member || !momod)
                return client.constant.usage(message, this.options.name, this.options.args);
            const ifStaff = yield StaffList_1.ifStaff(momod);
            if (!ifStaff) {
                if (!momod.hasPermission('ADMINISTRATOR')) {
                    return message.reply('anda tidak memiliki ijin untuk menggunakan command ini!');
                }
            }
            const muteRole = message.guild.roles.cache.filter(r => r.name === 'Muted').first();
            if (!muteRole)
                return message.reply('tidak ada role yang bernama **Muted**.');
            const warnList = yield WarnList_1.default.findAll({ where: { serverID: member.guild.id, memberID: member.id } });
            const counting = warnList.length + 1;
            let res = `<@!${member.id}> berhasil diwarn dengan alasan:\n\`\`\`${rlReason}\`\`\``;
            if (!(yield StaffList_1.ifStaff(member)) && !member.hasPermission('ADMINISTRATOR')) {
                res = `<@!${member.id}> berhasil diwarn untuk ke-${counting} dengan alasan:\n\`\`\`${rlReason}\`\`\``;
                yield WarnList_1.default.create({
                    serverID: member.guild.id,
                    memberID: member.id,
                    reason: rlReason,
                    staffID: momod.id,
                    dateExecuted: moment_1.default().format()
                });
                switch (counting) {
                    case 3:
                        TempMute_1.setTempMute(client, member, muteRole, '3h', rlReason).then(victim => {
                            message.channel.send(`3x Warn berlalu. <@!${member.id}> berhasil dibungkam selama ${victim.intTime} ${victim.prettyTime}.`);
                        });
                        break;
                    case 4:
                        TempMute_1.setTempMute(client, member, muteRole, '1d', rlReason).then(victim => {
                            message.channel.send(`4x Warn berlalu. <@!${member.id}> berhasil dibungkam selama ${victim.intTime} ${victim.prettyTime}.`);
                        });
                        break;
                    case 5:
                        yield member.createDM()
                            .then(memberCH => {
                            memberCH.send(`Anda telah ditendang dari ${message.guild.name} dikarenakan 5x Warn berlalu dengan alasan:\n\`\`\`${reason}\`\`\``);
                        })
                            .catch(_err => {
                        });
                        yield member.kick(`${rlReason} | ${message.author.tag}`)
                            .then(_mem => {
                            message.channel.send(`5x Warn berlalu. <@!${member.id}> berhasil ditendang!`);
                        });
                        break;
                    case 7:
                        yield member.createDM()
                            .then(memberCH => {
                            memberCH.send(`Anda telah dipalu dari ${message.guild.name} dikarenakan 7x Warn berlalu dengan alasan:\n\`\`\`${reason}\`\`\`\nKamu bisa memberi banding kepada staff yang memalu dirimu.`);
                        })
                            .catch(_err => {
                        });
                        yield member.ban({ reason: `${rlReason} | ${message.author.tag}` })
                            .then(() => {
                            message.channel.send(`7x Warn berlalu. <@!${member.id}> berhasil dipalu! Masih bisa banding kok!`);
                        });
                        break;
                    case 9:
                        yield member.createDM()
                            .then(memberCH => {
                            memberCH.send(`Anda telah dipalu permanen dari ${message.guild.name} dikarenakan 9x Warn berlalu dengan alasan:\n\`\`\`${reason}\`\`\`\n`);
                        })
                            .catch(_err => {
                        });
                        yield member.ban({ reason: `${rlReason} | ${message.author.tag}` })
                            .then(() => {
                            message.channel.send(`9x Warn berlalu. <@!${member.id}> berhasil dipalu dengan permanen!`);
                        });
                        break;
                }
            }
            yield message.reply(res);
        });
    }
}
exports.default = Warn;
//# sourceMappingURL=Warn.js.map