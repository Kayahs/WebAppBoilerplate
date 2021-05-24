import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'
import chalk from 'chalk'
import { ApolloServer } from 'apollo-server-express'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import corsConfig from './config/cors.js'
import postgres from './config/postgres'
import typeDefs from './gql/schema'
import resolvers from './gql/resolvers'
import { authUtil } from './utils'
import { salt } from './config/options.json'

//Load environment variables
dotenv.config()

//Initialize express server
const app = express()

//Load environment variables into local variables
const PORT = process.env.NODE_ENV === 'development' ? process.env.DEV_PORT : 3000
const secret = process.env.JWT_SECRET
const cookieName = process.env.JWT_COOKIE_NAME
const smtpEmail = process.env.SMTP_EMAIL
const smtpPass = process.env.SMTP_PASSWORD

//Add cookie parser middleware for authentication
app.use(cookieParser())

//Load cors configuration
app.use(cors(corsConfig))

//If not in development, load built client files from build folder
if (process.env.NODE_ENV !== 'development') {
  const root = path.resolve(__dirname, '../client/build')

  app.use(express.static(root))

  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/build/index.html'), function (err) {
      if (err) {
        res.status(500).send(err)
      }
    })
  })
}

//Initialize Apollo Server
const apolloServer = new ApolloServer({
  context: async ({ req }) => {
    //Set up nodemailer to use gmail information in environment variables
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpEmail,
        pass: smtpPass
      }
    })

    /*
      Return context to graphql resolvers
      app:
        secret: Value used for hashing/decoding
        cookieName: Name used for cookie storage
        salt: Value used for hashing/decoding
      req: Request sent to server
      postgres: Active postgres connection for resolvers to use
      authUtil: Functions used for authentication
      transporter: nodemailer connection to send emails
    */
    return {
      app: { secret, cookieName, salt },
      req,
      postgres,
      authUtil,
      transporter
    }
  },
  typeDefs,
  resolvers
})

//Apply express server and cors as middleware to Apollo Server
apolloServer.applyMiddleware({
  app,
  cors: corsConfig
})

//Handle Postgres error
postgres.on('error', (err, client) => {
  console.error('Unexpected error on idle postgres client', err)
  process.exit(-1)
})

//Start listen for Express server
const server = app.listen(PORT, () => {
  console.log(`>> ${chalk.blue('Express running:')} http://localhost:${PORT}`)
  console.log(`>> ${chalk.magenta('GraphQL playground:')} http://localhost:${PORT}/graphql`)
})

//Handle server error
server.on('error', (err) => {
  console.log(err)
})
