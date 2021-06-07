"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Client_1 = tslib_1.__importDefault(require("./App/Client"));
const LoadEvents_1 = tslib_1.__importDefault(require("./Engine/LoadEvents"));
const LoadCommand_1 = tslib_1.__importDefault(require("./Engine/LoadCommand"));
const console_stamp_1 = tslib_1.__importDefault(require("console-stamp"));
const moment_1 = tslib_1.__importDefault(require("moment"));
require("dotenv/config");
console_stamp_1.default(console);
moment_1.default.locale('id');
const client = new Client_1.default({
    fetchAllMembers: false,
    disableMentions: 'everyone'
});
LoadEvents_1.default(client);
LoadCommand_1.default(client);
client.login(process.env.TOKEN);
//# sourceMappingURL=Index.js.map
