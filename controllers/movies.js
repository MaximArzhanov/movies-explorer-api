const Movie = require('../models/movie');

const {
  errorTextMovieNotFound,
  errorTextCannotDeleteMovie,
  errorTextMovieAlreadyExist,
} = require('../utils/constants');

const {
  checkIsDataEmpty,
  handleNotFoundError,
  handleDataAlreadyExistError,
} = require('../utils/utils');

const ForbiddenError = require('../errors/forbidden-err');

// Проверяет, принадлежит ли удаляемый фильм текущему пользователю
const checkUserIsOwnerMovie = (movie, req) => {
  if (req.user._id !== movie.owner.toString()) {
    throw new ForbiddenError(errorTextCannotDeleteMovie);
  }
};

/** Находит все фильмы в базе данных и отправляет ответ */
module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};

/** Создаёт новый фильм в базе данных и отправляет ответ */
module.exports.createMovie = (req, res, next) => {
  Movie.create({
    country: req.body.country,
    director: req.body.director,
    duration: req.body.duration,
    year: req.body.year,
    description: req.body.description,
    image: req.body.image,
    trailerLink: req.body.trailerLink,
    nameRU: req.body.nameRU,
    nameEN: req.body.nameEN,
    thumbnail: req.body.thumbnail,
    movieId: req.body.movieId,
    owner: req.user._id,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => { handleDataAlreadyExistError(err, next, errorTextMovieAlreadyExist); });
};

/** Находит фильм в базе данных по id и удаляет его */
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      checkIsDataEmpty(movie, errorTextMovieNotFound);
      checkUserIsOwnerMovie(movie, req);
      // Удаление фильма
      Movie.deleteOne({ _id: req.params.movieId })
        .then((data) => res.send({ data }))
        .catch(next);
    })
    .catch((err) => { handleNotFoundError(err, next, errorTextMovieNotFound); });
};
