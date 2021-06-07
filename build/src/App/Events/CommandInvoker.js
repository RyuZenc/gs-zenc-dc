"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Events_1 = tslib_1.__importDefault(require("../Events"));
const Cooldown_1 = tslib_1.__importDefault(require("../Module/Command/Cooldown"));
class CommandInvoker extends Events_1.default {
    constructor() {
        super('message');
    }
    run(client, message) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const content = message.content;
            const args = content.split(' ');
            const cmdName = args[0].substring(client.config.botPrefix.length);
            const command = client.command.get(cmdName) || client.command.get(client.alias.get(cmdName));
            if (message.author.bot)
                return;
            if (!message.content.startsWith(client.config.botPrefix))
                return;
            if (!command)
                return;
            const commandName = typeof command.options.name !== 'string'
                ? command.options.name[0]
                : command.options.name;
            const isStillCooldown = Cooldown_1.default(client, message, command);
            if (isStillCooldown.result && !client.config.owner.includes(message.author.id)) {
                return message.reply(`please wait until ${isStillCooldown.diff} seconds.`);
            }
            if (command.options.ownerOnly && !client.config.owner.includes(message.author.id)) {
                return message.reply('this command for owner only.');
            }
            try {
                command.run(client, message, args.slice(1));
            }
            catch (error) {
                console.error(error);
                message.reply('something wrong with server. Try again later.');
            }
            finally {
                console.log(`${message.author.tag} [${message.author.id}] executing "${commandName}" in <${message.guild.name}|${message.channel.id}> server.`);
            }
        });
    }
}
exports.default = CommandInvoker;
//# sourceMappingURL=CommandInvoker.js.map