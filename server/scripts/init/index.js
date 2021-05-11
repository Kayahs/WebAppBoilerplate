import fs from 'fs'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'

dotenv.config()

const saltRounds = process.env.SALT_ROUNDS
const defaultPassword = process.env.DEFAULT_PASSWORD

const salt = bcrypt.genSaltSync(parseInt(saltRounds))
const hashedPassword = bcrypt.hashSync(defaultPassword, salt)

fs.writeFileSync('config/options.json', JSON.stringify({ salt }))
