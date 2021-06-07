"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Command_1 = tslib_1.__importDefault(require("../../Command"));
class Avatar extends Command_1.default {
    constructor() {
        super({
            name: 'avatar',
            description: 'Liat avatar.',
            args: [
                { name: 'uID|mention', require: true, type: 'BLOCK' }
            ],
            example: 'userinfo <@!709668494563868695>'
        });
    }
    run(client, message, args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.author;
            if (!user)
                return client.constant.usage(message, this.options.name, this.options.args);
            const member = message.guild.members.cache.get(user.id);
            if (!member)
                return message.reply('member tidak ditemukan!');
            message.channel.send(`Link: ${member.user.displayAvatarURL({ format: 'png' })}`);
        });
    }
}
exports.default = Avatar;
//# sourceMappingURL=Avatar.js.map