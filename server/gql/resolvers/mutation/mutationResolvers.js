import bcrypt, { hashSync } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import Promise from 'bluebird'

export default {
  Mutation: {
    async login(
      p,
      { input: { email, password } },
      { app: { secret, cookieName, salt }, req, postgres, authUtil },
      i
    ) {
      try {
        const emailLC = email.toString().toLowerCase()

        const findUserQ = {
          text: 'SELECT * FROM portfolio.users WHERE email = $1',
          values: [emailLC]
        }

        const findUserR = await postgres.query(findUserQ)
        const user = findUserR.rows[0]

        if (!user) throw 'Invalid email or password.'
        const valid = bcrypt.compareSync(password, user.password)
        if (!valid) throw 'Invalid email or password.'

        const csrfTokenBinary = await Promise.promisify(crypto.randomBytes)(32)
        const csrfToken = Buffer.from(csrfTokenBinary, 'binary').toString('base64')
        authUtil.setCookie(cookieName, authUtil.generateToken(user, secret, csrfToken), req.res)

        return {
          user,
          csrfToken
        }
      } catch (e) {
        return { message: e.message || e }
      }
    },
    async signup(
      p,
      { input: { email, password, fullname } },
      { app: { secret, cookieName, salt }, req, postgres, authUtil },
      i
    ) {
      try {
        const emailLC = email.toString().toLowerCase()
        const hashedPW = bcrypt.hashSync(password, salt)

        const addUserQ = {
          text:
            'INSERT INTO portfolio.users (fullname, email, password) VALUES ($1, $2, $3) RETURNING *',
          values: [fullname, emailLC, hashedPW]
        }

        const addUserR = await postgres.query(addUserQ)
        const user = addUserR.rows[0]

        const csrfTokenBinary = await Promise.promisify(crypto.randomBytes)(32)
        const csrfToken = Buffer.from(csrfTokenBinary, 'binary').toString('base64')
        authUtil.setCookie(cookieName, authUtil.generateToken(user, secret, csrfToken), req.res)

        return {
          user,
          csrfToken
        }
      } catch (e) {
        switch (e.constraint) {
          case 'users_email_key':
            return { message: 'That email address is already in use.' }
          default:
            return { message: e.message || e }
        }
      }
    },
    async sendEmail(p, { input: { to, subject, text, html } }, { transporter }, i) {
      let info = await transporter.sendMail({
        from: '"Akshay Manchanda" <akshaykmanchanda@gmail.com>',
        to: to,
        subject: subject,
        text: text,
        html: `<p>${html}</p>`
      })

      console.log(info)

      return { message: 'Done sending email.' }
    }
  }
}
