"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
exports.default = (client) => {
    fs_1.default.readdir(path_1.default.join(__dirname, '../App/Events'), (err, events) => {
        if (err)
            throw err;
        events.forEach((event) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const extName = event.split('.').pop();
            if (extName !== 'js')
                return;
            const _evt = yield Promise.resolve().then(() => tslib_1.__importStar(require(path_1.default.join(__dirname, `../App/Events/${event}`))));
            const evt = new _evt.default();
            client.on(evt.events, (...args) => {
                evt.run(client, ...args);
            });
        }));
    });
};
//# sourceMappingURL=LoadEvents.js.map