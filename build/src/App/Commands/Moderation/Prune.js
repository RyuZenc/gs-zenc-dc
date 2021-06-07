"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Command_1 = tslib_1.__importDefault(require("../../Command"));
const StaffList_1 = require("../../Module/Moderation/StaffList");
class Prune extends Command_1.default {
    constructor() {
        super({
            name: 'prune',
            description: 'Prune message dalam channel.',
            args: [
                { name: 'amount', require: true, type: 'BLOCK' }
            ],
            example: 'prune 20'
        });
    }
    run(client, message, args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const executor = yield message.guild.members.fetch(message.author.id);
            const amount = parseInt(args[0]);
            if (!amount)
                return client.constant.usage(message, this.options.name, this.options.args);
            const ifStaff = yield StaffList_1.ifStaff(executor);
            if (!ifStaff) {
                if (!executor.hasPermission('ADMINISTRATOR')) {
                    return message.reply('anda tidak memiliki ijin untuk menggunakan command ini!');
                }
            }
            yield message.delete();
            if (message.channel.type !== 'text')
                return message.reply('perintah ini hanya dapat digunakan di Text Channel server.');
            yield message.channel.bulkDelete(amount)
                .then(_channel => {
                message.channel.send(`Berhasil menghapus pesan sebanyak ${amount} pesan.`)
                    .then(msg => setTimeout(() => msg.delete(), 3000));
            })
                .catch(err => {
                message.reply(client.constant.errReason(err));
            });
        });
    }
}
exports.default = Prune;
//# sourceMappingURL=Prune.js.map