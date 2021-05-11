import jwt from 'jsonwebtoken'

const generateToken = (user, secret, csrfToken) => {
  const payload = {
    user,
    csrfToken,
    exp: Math.floor(Date.now() / 1000) + 2 * (60 * 60)
  }
  return jwt.sign(payload, secret)
}

export default generateToken
