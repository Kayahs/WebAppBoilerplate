import fs from 'fs'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'

//Load Environment Variables
dotenv.config()

const saltRounds = process.env.SALT_ROUNDS
const defaultPassword = process.env.DEFAULT_PASSWORD

//Generate salt
const salt = bcrypt.genSaltSync(parseInt(saltRounds))

//Save generated salt to options
fs.writeFileSync('config/options.json', JSON.stringify({ salt }))
