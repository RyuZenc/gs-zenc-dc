"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ifEventCommitee = exports.GetECList = void 0;
const tslib_1 = require("tslib");
const EventCommiteeGSP_1 = tslib_1.__importDefault(require("../../Models/EventCommiteeGSP"));
function GetECList(serverID) {
    return new Promise((resolve, reject) => {
        EventCommiteeGSP_1.default
            .findAll({ where: { serverID: serverID } })
            .then(evtCom => resolve(evtCom.map(e => e.roleID)))
            .catch(err => reject(err));
    });
}
exports.GetECList = GetECList;
function ifEventCommitee(member) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const ecList = yield GetECList(member.guild.id);
        return new Promise((resolve, _reject) => {
            if (!member)
                resolve(false);
            let trigger = false;
            ecList.forEach(ec => {
                if (member.roles.cache.has(ec))
                    trigger = true;
            });
            resolve(trigger);
        });
    });
}
exports.ifEventCommitee = ifEventCommitee;
//# sourceMappingURL=EventCommitee.js.map