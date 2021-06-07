"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _Connection_1 = require("./_Connection");
const sequelize_1 = require("sequelize");
exports.default = _Connection_1.Sequelize.define('tbl_temp_mute', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    serverID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    memberID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    startTime: {
        type: 'DATETIME',
        allowNull: false
    },
    expired: {
        type: 'DATETIME',
        allowNull: false
    },
    reason: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    executed: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false
});
//# sourceMappingURL=TempMute.js.map