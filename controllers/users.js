const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const UserExistError = require('../errors/user-exist');
const { JWT_SECRET } = require('../config');
const { USER_NOT_FOUND, USER_EXIST } = require('../messages');

const {
  setResponse,
  HTTP_201,
} = require('../utils/utils');

const findUserById = (req, res, next, userId) => {
  User.findById(userId)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError(USER_NOT_FOUND);
      }

      setResponse({ res, messageKey: 'data', message: user });
    })
    .catch(next);
};

const profileUpdateResponse = (res, req, next, profile) => {
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    profile,
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user === null) {
        throw new NotFoundError(USER_NOT_FOUND);
      }

      setResponse({ res, messageKey: 'user', message: user });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new UserExistError(USER_EXIST));
      }

      next(err);
    });
};

const getMe = (req, res, next) => {
  findUserById(req, res, next, req.user._id);
};

const registration = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => setResponse({
        res,
        messageKey: null,
        message: {
          _id: user.id,
          name: user.name,
          email: user.email,
        },
        httpStatus: HTTP_201,
      }))
      .catch((err) => {
        if (err.code === 11000) {
          next(new UserExistError());
        }

        next(err);
      }));
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;

  profileUpdateResponse(res, req, next, { name, email });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getMe,
  registration,
  updateUser,
  login,
};
