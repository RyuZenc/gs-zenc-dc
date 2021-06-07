"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const moment_1 = tslib_1.__importDefault(require("moment"));
exports.default = {
    uptime: moment_1.default(),
    presence: {
        status: true,
        interval: 5000,
        message: [
            "Daddy! -w-",
            "Not a bot, but a robot.",
            "Watching you all",
            "Love you all!! (●♡∀♡)"
        ]
    },
    tempMute: new discord_js_1.Collection(),
    antiInvite: new discord_js_1.Collection(),
    badword: new discord_js_1.Collection(),
    register: new discord_js_1.Collection(),
    gesper: {
        personInCharge: '',
        serverID: '',
        channelID: '',
        eventName: '',
        uniqueMember: [],
        host: [],
        guest: [],
        started: false,
        whenStarted: moment_1.default()
    }
};
//# sourceMappingURL=DefaultState.js.map