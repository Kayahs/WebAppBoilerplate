import { AuthenticationError } from 'apollo-server'
import jwt from 'jsonwebtoken'

/*
  Function to check if cookie in req is valid and matches cookie in header
*/
const authenticate = (secret, cookieName, req) => {
  //Load cookie from the request
  const cookie = req.cookies[cookieName]
  try {
    //Extract information from cookie
    const { user, csrfToken, exp } = jwt.verify(cookie, secret)

    //Extract csrf Token from header
    const headerToken = req.get('authorization').replace('Bearer ', '')

    //Check if header token matches cookie token and if expiry date has passed
    const isValidCSRF = headerToken === csrfToken || exp < Math.floor(Date.now() / 1000)

    //If token is invalid, throw authentication error
    if (!isValidCSRF) {
      throw new AuthenticationError('Unauthorized')
    }

    //Return user stored in cookie if token is valid
    return user
  } catch (e) {
    throw new AuthenticationError('Unauthorized')
  }
}

export default authenticate
