const { HTTP_403 } = require('../utils/utils');
const { ERROR_403 } = require('../messages');

class AccessDeniedError extends Error {
  constructor(message = ERROR_403) {
    super(message);
    this.statusCode = HTTP_403;
  }
}

module.exports = AccessDeniedError;
