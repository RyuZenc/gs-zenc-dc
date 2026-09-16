require('dotenv').config()
const path = require('path')
const { Sequelize } = require('sequelize')
const Umzug = require('umzug')

const databaseUrl = process.env.DATABASE_URL
const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: path.join(__dirname, './database.db')
    })
const umzug = new Umzug({
  migrations: {
    path: path.join(__dirname, './migrations'),
    params: [
      sequelize.getQueryInterface()
    ]
  },
  storage: 'sequelize',
  storageOptions: {
    sequelize: sequelize
  }
})

;(async () => {
  const prompt = process.argv.slice(-1)[0]
  prompt === 'up' ? await umzug.up() : await umzug.down()
  console.log('All migrations performed successfully!')
})()
