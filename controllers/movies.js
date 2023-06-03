const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const AccessDeniedError = require('../errors/acces-denied');
const {
  setResponse,
  HTTP_201,
} = require('../utils/utils');

module.exports.getMyMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .populate(['owner'])
    .then((movies) => setResponse({
      res,
      messageKey: 'data',
      message: movies,
    }))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const params = req.body;
  params.owner = req.user._id;

  Movie.create(params)
    .then((_movie) => {
      Movie.findById(_movie._id)
        .populate(['owner'])
        .then((movie) => setResponse({
          res, messageKey: null, message: movie, httpStatus: HTTP_201,
        }));
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден');
      }

      if (movie.owner.toString() !== req.user._id) {
        throw new AccessDeniedError('Вы не можете удалить чужой фильм');
      }

      movie.deleteOne()
        .then(() => {
          setResponse({ res, message: 'Фильм удален' });
        })
        .catch(next);
    })
    .catch(next);
};
