"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkConnection = exports.Sequelize = void 0;
const tslib_1 = require("tslib");
const sequelize_1 = require("sequelize");
const path_1 = tslib_1.__importDefault(require("path"));
const databaseUrl = process.env.DATABASE_URL;
const storagePath = path_1.default.join(__dirname, '../../../../Database/database.db');
const sequelize = databaseUrl
    ? new sequelize_1.Sequelize(databaseUrl, {
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    })
    : new sequelize_1.Sequelize({
        dialect: 'sqlite',
        storage: storagePath,
        logging: false
    });
exports.Sequelize = sequelize;
const checkConnection = () => {
    return sequelize.authenticate({ logging: false })
        .then(() => true);
};
exports.checkConnection = checkConnection;
//# sourceMappingURL=_Connection.js.map