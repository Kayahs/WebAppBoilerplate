export default {
  LoginResult: {
    __resolveType(obj, context, info) {
      if (obj.message) {
        return 'Error'
      }

      if (obj.user) {
        return 'LoginResponse'
      }
    }
  }
}
