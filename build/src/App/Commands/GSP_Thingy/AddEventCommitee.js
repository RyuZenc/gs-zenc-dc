"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Command_1 = tslib_1.__importDefault(require("../../Command"));
const StaffList_1 = require("../../Module/Moderation/StaffList");
const EventCommiteeGSP_1 = tslib_1.__importDefault(require("../../Models/EventCommiteeGSP"));
class AddEventCommitee extends Command_1.default {
    constructor() {
        super({
            name: 'gspec',
            description: 'Tambah/kurang event commitee.',
            args: [
                { name: 'add|remove', require: true, type: 'BLOCK' }
            ],
            example: 'gspec add 644367677665837056'
        });
    }
    run(client, message, args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const mode = args[0].toLowerCase();
            const roleID = args[1];
            const executor = yield message.guild.members.fetch(message.author.id);
            if ((!mode || !roleID) || !['add', 'remove'].includes(mode))
                return client.constant.usage(message, this.options.name, this.options.args);
            const ifStaff = yield StaffList_1.ifStaff(executor);
            if (!ifStaff) {
                if (!executor.hasPermission('ADMINISTRATOR')) {
                    return message.reply('anda tidak memiliki ijin untuk menggunakan command ini!');
                }
            }
            const role = yield message.guild.roles.fetch(roleID);
            if (!role)
                return message.reply('role tidak ditemukan!');
            if (mode === 'add') {
                EventCommiteeGSP_1.default
                    .findOne({ where: { serverID: message.guild.id, roleID: roleID } })
                    .then((data) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    data
                        ? yield data.update({ serverID: message.guild.id, roleID: roleID })
                        : yield EventCommiteeGSP_1.default.create({ serverID: message.guild.id, roleID: roleID });
                    yield message.reply(`<@&${roleID}> berhasil ditambahkan!`);
                }))
                    .catch(err => {
                    message.reply(client.constant.errReason(err));
                });
            }
            if (mode === 'remove') {
                EventCommiteeGSP_1.default.destroy({
                    where: { serverID: message.guild.id, roleID: roleID }
                })
                    .then(() => {
                    message.reply(`<@&${roleID}> berhasil dihapus!`);
                })
                    .catch(err => {
                    message.reply(client.constant.errReason(err));
                });
            }
        });
    }
}
exports.default = AddEventCommitee;
//# sourceMappingURL=AddEventCommitee.js.map