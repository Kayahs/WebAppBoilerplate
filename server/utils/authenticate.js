import { AuthenticationError } from 'apollo-server'
import jwt from 'jsonwebtoken'

const authenticate = (secret, cookieName, req) => {
  const cookie = req.cookies[cookieName]
  try {
    const { user, csrfToken, exp } = jwt.verify(cookie, secret)

    const headerToken = req.get('authorization').replace('Bearer ', '')
    const isValidCSRF = headerToken === csrfToken || exp < Math.floor(Date.now() / 1000)

    if (!isValidCSRF) {
      throw new AuthenticationError('Unauthorized')
    }

    return user
  } catch (e) {
    throw new AuthenticationError('Unauthorized')
  }
}

export default authenticate
