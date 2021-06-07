"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const config_json_1 = tslib_1.__importDefault(require("../config.json"));
const Constant_1 = tslib_1.__importDefault(require("./Module/Constant"));
const DefaultState_1 = tslib_1.__importDefault(require("./DefaultState"));
class Client extends discord_js_1.Client {
    constructor(opt) {
        super(opt);
        this.command = new discord_js_1.Collection();
        this.alias = new discord_js_1.Collection();
        this.cooldown = new discord_js_1.Collection();
        this.constant = new Constant_1.default();
        this.help = new discord_js_1.Collection();
        this.config = config_json_1.default;
        this.state = DefaultState_1.default;
    }
}
exports.default = Client;
//# sourceMappingURL=Client.js.map