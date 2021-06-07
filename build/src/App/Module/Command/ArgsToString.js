"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (args) => {
    let str = '';
    args.forEach(arg => {
        if (arg.require === true && arg.type === 'BLOCK') {
            str += `<${arg.name}> `;
        }
        if (arg.require === false && arg.type === 'BLOCK') {
            str += `[${arg.name}] `;
        }
        if (arg.type === 'FLAG') {
            str += `--${arg.name} `;
        }
    });
    return str;
};
//# sourceMappingURL=ArgsToString.js.map