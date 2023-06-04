const { HTTP_401 } = require('../utils/utils');
const { ERROR_401 } = require('../messages');

class NotAuthorizedError extends Error {
  constructor(message = ERROR_401) {
    super(message);
    this.statusCode = HTTP_401;
  }
}

module.exports = NotAuthorizedError;
