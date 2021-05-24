/*
  Function to set cookie into server response
*/
const setCookie = (cookieName, token, res) => {
  //Set cookie into response
  res.cookie(cookieName, token, {
    httpOnly: true,
    //Set secure as true only if not in development environment
    secure: process.env.NODE_ENV !== 'development'
  })
}

export default setCookie
