const router = require('express').Router();
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');
const { validateCreateMovieBody, validateMovieIdParam } = require('../validators/movies');

router.get('/', getMovies);
router.post('/', validateCreateMovieBody, createMovie);
router.delete('/:cardId', validateMovieIdParam, deleteMovie);

module.exports = router;
