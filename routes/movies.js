const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const {
  validateDeleteMovieRoute,
  validateCreateMovieRoute,
} = require('../validators/validatation-joi');

router.get('/movies', getMovies);

router.post('/movies', validateCreateMovieRoute, createMovie);

router.delete('/movies/:movieId', validateDeleteMovieRoute, deleteMovie);

module.exports = router;
