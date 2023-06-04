const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail').default;
const bcrypt = require('bcryptjs');
const NotAuthorizedError = require('../errors/not-authorized');
const { VALIDATION_EMAIL, VALIDATION_EMAIL_OR_PASSWORD } = require('../messages');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    index: { unique: true },
    validate: {
      validator: (v) => isEmail(v),
      message: VALIDATION_EMAIL,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this
    .findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotAuthorizedError(VALIDATION_EMAIL_OR_PASSWORD));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new NotAuthorizedError(VALIDATION_EMAIL_OR_PASSWORD));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
