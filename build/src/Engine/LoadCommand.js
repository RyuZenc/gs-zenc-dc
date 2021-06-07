"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
exports.default = (client) => {
    fs_1.default.readdir(path_1.default.join(__dirname, '../App/Commands'), (err, categories) => {
        if (err)
            throw err;
        categories.forEach(category => {
            fs_1.default.readdir(path_1.default.join(__dirname, `../App/Commands/${category}`), (err, commands) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                if (err)
                    throw err;
                client.help.set(category, {
                    location: category,
                    command: [],
                    module: {
                        name: '',
                        hidden: false
                    }
                });
                fs_1.default.readFile(`./src/App/Commands/${category}/module.json`, (err, data) => {
                    if (err)
                        throw err;
                    client.help.get(category).module = JSON.parse(data.toString());
                });
                commands.forEach((command) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    const extName = command.split('.').pop();
                    if (extName !== 'js')
                        return;
                    const _cmd = yield Promise.resolve().then(() => tslib_1.__importStar(require(path_1.default.join(__dirname, `../App/Commands/${category}/${command}`))));
                    const cmd = new _cmd.default();
                    const commandName = typeof cmd.options.name !== 'string' ? cmd.options.name[0] : cmd.options.name;
                    client.command.set(commandName, cmd);
                    const aliases = typeof cmd.options.name !== 'string' ? cmd.options.name.slice(1) : [];
                    if (aliases.length > 0) {
                        aliases.forEach(alias => {
                            client.alias.set(alias, commandName);
                        });
                    }
                    const help = client.help.get(category);
                    if (help) {
                        help.command.push(`${command.split('.').slice(0, -1).join('.')}:${commandName}`);
                    }
                }));
            }));
        });
    });
};
//# sourceMappingURL=LoadCommand.js.map