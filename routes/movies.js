const router = require('express').Router();
const {
  getMyMovies, createMovie, deleteMovie,
} = require('../controllers/movies');
const { validateCreateMovieBody, validateMovieIdParam } = require('../validators/movies');

router.get('/', getMyMovies);
router.post('/', validateCreateMovieBody, createMovie);
router.delete('/:movieId', validateMovieIdParam, deleteMovie);

module.exports = router;
