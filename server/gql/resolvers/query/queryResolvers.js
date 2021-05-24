export default {
  Query: {
    async AllUsers(p, a, { app: { secret, cookieName }, req, postgres, authUtil }, i) {
      const getUsersQ = {
        text: 'SELECT * FROM schemaName.users'
      }

      const getUsersR = await postgres.query(getUsers)

      return getUsersR.rows
    }
  }
}
