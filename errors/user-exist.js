const { HTTP_409 } = require('../utils/utils');

class UserExistError extends Error {
  constructor(message = 'Такой пользователь уже есть') {
    super(message);
    this.statusCode = HTTP_409;
  }
}

module.exports = UserExistError;
