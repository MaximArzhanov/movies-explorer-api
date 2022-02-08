const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const {
  validateDeleteMovieRoute,
  validateCreateMovieRoute,
} = require('../validators/validatationJoi');

router.get('/movies', getMovies);

router.post('/movies', validateCreateMovieRoute(), createMovie);

router.delete('/movies/:movieId', validateDeleteMovieRoute(), deleteMovie);

module.exports = router;
