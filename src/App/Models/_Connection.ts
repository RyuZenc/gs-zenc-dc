import { Sequelize } from 'sequelize'
import Path from 'path'

const databaseUrl = process.env.DATABASE_URL
const storagePath = Path.join(__dirname, '../../../../Database/database.db')

const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, {
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: storagePath,
      logging: false
    })

const checkConnection = (): Promise<boolean> => {
  return sequelize.authenticate({ logging: false })
    .then(() => true)
}

export { sequelize as Sequelize, checkConnection }