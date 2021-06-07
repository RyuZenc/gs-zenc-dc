"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _Connection_1 = require("./_Connection");
const sequelize_1 = require("sequelize");
exports.default = _Connection_1.Sequelize.define('tbl_staff_list', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    serverID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    roleID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false
});
//# sourceMappingURL=StaffList.js.map