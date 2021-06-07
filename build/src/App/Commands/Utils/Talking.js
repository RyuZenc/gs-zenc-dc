"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Command_1 = tslib_1.__importDefault(require("../../Command"));
const yargs_parser_1 = tslib_1.__importDefault(require("yargs-parser"));
class Talking extends Command_1.default {
    constructor() {
        super({
            name: 'talk',
            description: 'Bicara sebagai felice.',
            args: [
                { name: 'channel', type: 'FLAG', require: false },
                { name: 'server', type: 'FLAG', require: false },
                { name: 'text', type: 'BLOCK', require: true }
            ],
            example: 'talk --channel=454637409288847371 --server=454637408479084566 Asdasdasd',
            ownerOnly: true
        });
    }
    run(client, message, _args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const args = yargs_parser_1.default(_args);
            const returnable = { channelID: '', serverID: '', text: args._.join(' ') };
            if (!returnable.text) {
                return client.constant.usage(message, this.options.name, this.options.args);
            }
            returnable.serverID = args.server || message.guild.id;
            returnable.channelID = message.mentions.channels.first() || args.channel || message.channel.id;
            const server = client.guilds.cache.get(returnable.serverID);
            if (!server)
                return message.reply('server tidak ditemukan!');
            const channel = server.channels.cache.get(returnable.channelID);
            if (!channel)
                return message.reply('channel tidak ditemukan!');
            yield message.react('👍');
            yield channel.send(returnable.text);
        });
    }
}
exports.default = Talking;
//# sourceMappingURL=Talking.js.map