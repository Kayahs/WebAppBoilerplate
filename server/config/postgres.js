import { Pool } from 'pg'
import pgconfig from './default.json'

const postgres = new Pool(pgconfig.db)

export default postgres
