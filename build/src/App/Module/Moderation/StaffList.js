"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ifStaff = exports.GetStaffList = void 0;
const tslib_1 = require("tslib");
const StaffList_1 = tslib_1.__importDefault(require("../../Models/StaffList"));
function GetStaffList(serverID) {
    return new Promise((resolve, reject) => {
        StaffList_1.default
            .findAll({ where: { serverID: serverID } })
            .then(staff => resolve(staff.map(st => st.roleID)))
            .catch(err => reject(err));
    });
}
exports.GetStaffList = GetStaffList;
function ifStaff(member) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const staffList = yield GetStaffList(member.guild.id);
        return new Promise((resolve, _reject) => {
            if (!member)
                resolve(false);
            let triggerStaff = false;
            staffList.forEach(st => {
                if (member.roles.cache.has(st))
                    triggerStaff = true;
            });
            resolve(triggerStaff);
        });
    });
}
exports.ifStaff = ifStaff;
//# sourceMappingURL=StaffList.js.map