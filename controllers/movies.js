const Card = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const AccessDeniedError = require('../errors/acces-denied');
const {
  setResponse,
  HTTP_201,
} = require('../utils/utils');

module.exports.getMovies = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => setResponse({
      res,
      messageKey: 'data',
      message: cards,
    }))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((_card) => {
      Card.findById(_card._id)
        .populate(['owner'])
        .then((card) => setResponse({
          res, messageKey: null, message: card, httpStatus: HTTP_201,
        }));
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Фильм не найден');
      }

      if (card.owner.toString() !== req.user._id) {
        throw new AccessDeniedError('Вы не можете удалить чужой фильм');
      }

      card.deleteOne()
        .then(() => {
          setResponse({ res, message: 'Фильм удален' });
        })
        .catch(next);
    })
    .catch(next);
};
