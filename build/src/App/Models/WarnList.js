"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _Connection_1 = require("./_Connection");
const sequelize_1 = require("sequelize");
exports.default = _Connection_1.Sequelize.define('tbl_warn_list', {
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
    staffID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    reason: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    dateExecuted: {
        type: 'DATETIME',
        allowNull: false
    }
}, {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false
});
//# sourceMappingURL=WarnList.js.map