"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Command_1 = tslib_1.__importDefault(require("../../Command"));
class ReloadCommand extends Command_1.default {
    constructor() {
        super({
            name: 'reload',
            description: 'Reload command',
            args: [
                { name: 'command', type: 'BLOCK', require: true }
            ],
            example: 'reload ping',
            ownerOnly: true
        });
    }
    run(client, message, args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!args.length)
                return client.constant.usage(message, this.options.name, this.options.args);
            let commandFile = '';
            const cmd = args[0].toLowerCase();
            const command = client.command.get(cmd);
            const help = client.help.find(hel => {
                let ret = false;
                hel.command.forEach(com => {
                    const realCom = com.split(':');
                    if (realCom[1] === cmd) {
                        commandFile = realCom[0];
                        ret = true;
                    }
                });
                return ret;
            });
            if (!command || !help)
                return message.reply('no command found. Please try again.');
            try {
                const location = `../${help.location}/${commandFile}.js`;
                delete require.cache[require.resolve(location)];
                const _newCommand = yield Promise.resolve().then(() => tslib_1.__importStar(require(location)));
                const newCommand = new _newCommand.default();
                client.command.set(cmd, newCommand);
                yield message.reply(`command **"${cmd}"** successfully reloaded!`);
            }
            catch (error) {
                console.error(error);
                message.reply(`there was something wrong when reloading "${cmd}" command.\n\`\`\`${error.message}\`\`\``);
            }
        });
    }
}
exports.default = ReloadCommand;
//# sourceMappingURL=ReloadCommand.js.map