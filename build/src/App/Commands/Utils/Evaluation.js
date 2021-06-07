"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Command_1 = tslib_1.__importDefault(require("../../Command"));
const util_1 = tslib_1.__importDefault(require("util"));
class Evaluation extends Command_1.default {
    constructor() {
        super({
            name: 'eval',
            description: 'Evaluate code',
            args: [
                { name: 'code', type: 'BLOCK', require: true }
            ],
            example: 'reload <blockJSCode>',
            ownerOnly: true
        });
    }
    run(client, message, args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const code = args.join(' ');
            if (!code)
                return client.constant.usage(message, this.options.name, this.options.args);
            try {
                let ev = eval(code);
                console.log(ev);
                if (typeof ev !== 'string') {
                    ev = util_1.default.inspect(ev, { depth: 0 });
                }
                message.channel.send(`\`\`\`${ev}\`\`\``);
            }
            catch (error) {
                console.error(error);
                message.channel.send(error.message);
            }
        });
    }
}
exports.default = Evaluation;
//# sourceMappingURL=Evaluation.js.map