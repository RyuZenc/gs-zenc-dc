"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Command_1 = tslib_1.__importDefault(require("../../Command"));
const StaffList_1 = tslib_1.__importDefault(require("../../Models/StaffList"));
class AddStaff extends Command_1.default {
    constructor() {
        super({
            name: 'managestaff',
            description: 'Tambah/hapus role staff untuk mengeksekusi perintah moderasi.',
            args: [
                { name: 'add|remove', require: true, type: 'BLOCK' },
                { name: 'roleID', require: true, type: 'BLOCK' }
            ],
            example: 'managestaff add 709668494563868695'
        });
    }
    run(client, message, args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const _mode = args[0];
            const roleID = args[1];
            if (!_mode || !roleID)
                return client.constant.usage(message, this.options.name, this.options.args);
            const mode = _mode.toLowerCase();
            if (!['add', 'remove'].includes(mode))
                return client.constant.usage(message, this.options.name, this.options.args);
            const user = yield message.guild.members.fetch(message.author.id);
            if (!user)
                return;
            if (!user.hasPermission('ADMINISTRATOR') && !client.config.owner.includes(user.id)) {
                return message.reply('hanya ADMIN yang bisa mengeksekusi perintah ini.');
            }
            const role = yield message.guild.roles.fetch(roleID);
            if (!role)
                return message.reply('role tidak ditemukan!');
            if (mode === 'add') {
                StaffList_1.default
                    .findOne({ where: { serverID: message.guild.id, roleID: roleID } })
                    .then((data) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    data
                        ? yield data.update({ serverID: message.guild.id, roleID: roleID })
                        : yield StaffList_1.default.create({ serverID: message.guild.id, roleID: roleID });
                    yield message.reply(`<@&${roleID}> berhasil ditambahkan!`);
                }))
                    .catch(err => {
                    message.reply(client.constant.errReason(err));
                });
            }
            if (mode === 'remove') {
                StaffList_1.default.destroy({
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
exports.default = AddStaff;
//# sourceMappingURL=AddStaff.js.map