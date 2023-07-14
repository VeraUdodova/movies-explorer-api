const { HTTP_400 } = require('../utils/utils');
const { ERROR_400 } = require('../messages');

class ValidationError extends Error {
  constructor(message = ERROR_400) {
    super(message);
    this.statusCode = HTTP_400;
  }
}

module.exports = ValidationError;
