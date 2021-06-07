"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Events_1 = tslib_1.__importDefault(require("../Events"));
const sequelize_1 = tslib_1.__importDefault(require("sequelize"));
const AntiInviteServer_1 = tslib_1.__importDefault(require("../Models/AntiInviteServer"));
const AntiInviteImmune_1 = tslib_1.__importDefault(require("../Models/AntiInviteImmune"));
const BadwordList_1 = tslib_1.__importDefault(require("../Models/BadwordList"));
const BadwordImmune_1 = tslib_1.__importDefault(require("../Models/BadwordImmune"));
const Badword_1 = tslib_1.__importDefault(require("../Module/Moderation/Badword"));
const RegisterRole_1 = tslib_1.__importDefault(require("../Models/RegisterRole"));
class DatabaseToState extends Events_1.default {
    constructor() {
        super('ready');
    }
    run(client) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            AntiInviteServer_1.default.findAll()
                .then(_data => {
                _data.forEach((data) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    client.state.antiInvite.set(data.serverID, []);
                    const roleList = yield AntiInviteImmune_1.default.findAll({
                        where: { serverID: data.serverID }
                    });
                    roleList.forEach(role => {
                        const container = client.state.antiInvite.get(data.serverID);
                        if (!container)
                            return;
                        container.push(role.roleID);
                    });
                }));
            });
            const _bwListServer = yield BadwordList_1.default.findAll({
                attributes: [
                    [sequelize_1.default.fn('DISTINCT', sequelize_1.default.col('serverID')), 'serverID']
                ]
            });
            const bwListServer = _bwListServer.map(val => val.serverID);
            bwListServer.forEach((serverID) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                client.state.badword.set(serverID, {
                    immune: (yield BadwordImmune_1.default.findAll({
                        where: { serverID }
                    })).map(val => val.roleID),
                    list: new Badword_1.default((yield BadwordList_1.default.findAll({
                        where: { serverID }
                    })).map(val => val.badword))
                });
            }));
            RegisterRole_1.default.findAll({
                attributes: [
                    [sequelize_1.default.fn('DISTINCT', sequelize_1.default.col('serverID')), 'serverID'],
                    'roleID'
                ]
            })
                .then(regist => {
                regist.forEach(reg => client.state.register.set(reg.serverID, reg.roleID));
            });
        });
    }
}
exports.default = DatabaseToState;
//# sourceMappingURL=DatabaseToState.js.map