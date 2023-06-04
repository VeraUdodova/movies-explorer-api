const { HTTP_409 } = require('../utils/utils');
const { ERROR_409 } = require('../messages');

class UserExistError extends Error {
  constructor(message = ERROR_409) {
    super(message);
    this.statusCode = HTTP_409;
  }
}

module.exports = UserExistError;
