import jwt from 'jsonwebtoken'

/*
  Function to generate a json web token
*/
const generateToken = (user, secret, csrfToken) => {
  //set jwt payload
  const payload = {
    //Graphql User Variable
    user,
    //Cross-site request forgery
    csrfToken,
    //Set expiry date to be 2 hours from generation
    exp: Math.floor(Date.now() / 1000) + 2 * (60 * 60)
  }

  //Return signed jwt
  return jwt.sign(payload, secret)
}

export default generateToken
