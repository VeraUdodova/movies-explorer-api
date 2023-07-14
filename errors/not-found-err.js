const { HTTP_404 } = require('../utils/utils');
const { ERROR_404 } = require('../messages');

class NotFoundError extends Error {
  constructor(message = ERROR_404) {
    super(message);
    this.statusCode = HTTP_404;
  }
}

module.exports = NotFoundError;
