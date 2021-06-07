"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkConnection = exports.Sequelize = void 0;
const tslib_1 = require("tslib");
const sequelize_1 = require("sequelize");
const path_1 = tslib_1.__importDefault(require("path"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const storagePath = path_1.default.join(__dirname, '../../../../Database/database.db');
const sequelize = new sequelize_1.Sequelize({
    dialect: 'sqlite',
    storage: storagePath,
    logging: false
});
exports.Sequelize = sequelize;
const checkConnection = () => {
    return new Promise((resolve, reject) => {
        fs_1.default.readFile(storagePath, (err, _data) => {
            if (err)
                reject(err);
            sequelize.authenticate({ logging: false })
                .then(() => {
                resolve(true);
            })
                .catch(err => reject(err));
        });
    });
};
exports.checkConnection = checkConnection;
//# sourceMappingURL=_Connection.js.map