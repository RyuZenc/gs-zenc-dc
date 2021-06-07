"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const config_json_1 = tslib_1.__importDefault(require("../../config.json"));
const ArgsToString_1 = tslib_1.__importDefault(require("./Command/ArgsToString"));
class Constant {
    usage(message, name, args) {
        const fixedName = typeof name !== 'string' ? name[0] : name;
        return message.reply(`penggunaan yang tepat adalah:\n\`\`\`${config_json_1.default.botPrefix}${fixedName} ${ArgsToString_1.default(args)}\`\`\``);
    }
    errReason(err) {
        console.error(err);
        return `sepertinya ada kesalahan dengan perintah ini:\n\`\`\`${err.message}\`\`\``;
    }
}
exports.default = Constant;
//# sourceMappingURL=Constant.js.map