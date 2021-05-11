const setCookie = (cookieName, token, res) => {
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development'
  })
}

export default setCookie
