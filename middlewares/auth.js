const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const NotAuthorizedError = require('../errors/not-authorized');

const handleAuthError = (next) => {
  next(new NotAuthorizedError());
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(next);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return handleAuthError(next);
  }

  req.user = payload;

  next();

  return false;
};
