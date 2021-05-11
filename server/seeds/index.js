import { Pool } from 'pg'
import squel from 'squel'
import config from '../config/default.json'
import options from '../config/options.json'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'

dotenv.config()

const defaultPassword = process.env.DEFAULT_PASSWORD

const squelps = squel.useFlavour('postgres')

const hashedPassword = bcrypt.hashSync(defaultPassword, options.salt)

const userSeeds = [
  {
    fullname: 'Akshay Manchanda',
    email: 'akshaykmanchanda@gmail.com',
    password: hashedPassword
  }
]

const seed = async () => {
  const pg = await new Pool(config.db).connect()
  try {
    await pg.query('BEGIN')

    console.log('Seeding Users...')

    await Promise.all(
      userSeeds.map(userSeed =>
        pg.query(
          squelps
            .insert()
            .into('portfolio.users')
            .setFields(userSeed)
            .toParam()
        )
      )
    )

    console.log('Seeding Users... [DONE]')

    console.log('All Inserts Successful, Commiting Changes...')
    await pg.query('COMMIT')
    console.log('Changes Committed.')
  } catch (e) {
    await pg.query('ROLLBACK')
    throw e
  } finally {
    pg.release()
  }
}

seed().catch(e => {
  setImmediate(() => {
    throw e
  })
})
