"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTempMute = exports.isTimeValid = exports.parsingPlainTime = void 0;
const tslib_1 = require("tslib");
const TempMute_1 = tslib_1.__importDefault(require("../../Models/TempMute"));
const moment_1 = tslib_1.__importDefault(require("moment"));
function parsingPlainTime(plainTime) {
    const template = plainTime.substring(plainTime.length - 1);
    const time = parseInt(plainTime.substring(0, plainTime.length - 1));
    const now = moment_1.default();
    const rets = {
        prettyTime: '',
        engTime: '',
        intTime: 0,
        startTime: now,
        endTime: now
    };
    switch (template) {
        case 's':
            rets.prettyTime = 'detik';
            rets.engTime = 'seconds';
            rets.intTime = time;
            rets.startTime = now;
            rets.endTime = now.add(time, 's');
            break;
        case 'm':
            rets.prettyTime = 'menit';
            rets.engTime = 'minutes';
            rets.intTime = time;
            rets.startTime = now;
            rets.endTime = now.add(time, 'm');
            break;
        case 'h':
            rets.prettyTime = 'jam';
            rets.engTime = 'hours';
            rets.intTime = time;
            rets.startTime = now;
            rets.endTime = now.add(time, 'h');
            break;
        case 'd':
            rets.prettyTime = 'hari';
            rets.engTime = 'days';
            rets.intTime = time;
            rets.startTime = now;
            rets.endTime = now.add(time, 'd');
            break;
    }
    return rets;
}
exports.parsingPlainTime = parsingPlainTime;
function isTimeValid(plainTime) {
    const template = plainTime.substring(plainTime.length - 1);
    const time = parseInt(plainTime.substring(0, plainTime.length - 1));
    let boolRet;
    switch (template) {
        case 's':
        case 'm':
        case 'h':
        case 'd':
            boolRet = true;
            break;
        default:
            boolRet = false;
            break;
    }
    boolRet = !time || typeof time === 'undefined' || time < 0 ? false : true;
    return boolRet;
}
exports.isTimeValid = isTimeValid;
function setTempMute(client, member, role, plainTime, reason) {
    return new Promise((resolve, reject) => {
        const now = moment_1.default();
        const parsed = parsingPlainTime(plainTime);
        const endTime = parsed.endTime;
        TempMute_1.default
            .create({
            serverID: member.guild.id,
            memberID: member.id,
            startTime: now.format(),
            expired: endTime.format(),
            reason
        })
            .then((data) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            client.state.tempMute.set(`${data.serverID}:${data.memberID}`, endTime);
            yield member.roles.add(role);
            resolve(parsed);
        }))
            .catch(err => {
            reject(err);
        });
    });
}
exports.setTempMute = setTempMute;
//# sourceMappingURL=TempMute.js.map