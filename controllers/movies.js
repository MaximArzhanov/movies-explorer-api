const Movie = require('../models/movie');
const {
  errorTextMovieNotFound,
  errorTextCannotDeleteMovie,
  errorTextMovieAlreadyExist,
} = require('../utils/constants');

const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const ConflictError = require('../errors/conflict-err');

// Обработка ошибки movieAlreadyExist
const handleErrorMovieAlreadyExist = (err, next) => {
  if (err.code === 11000) {
    next(new ConflictError(errorTextMovieAlreadyExist));
  } else {
    next(err);
  }
};

// Обработка ошибок
const handleErrorMovieNotFound = (err, next) => {
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    next(new NotFoundError(errorTextMovieNotFound));
  } else {
    next(err);
  }
};

// Проверяет, принадлежит ли удаляемый фильм текущему пользователю
const checkUserIsOwnerMovie = (movie, req) => {
  if (req.user._id !== movie.owner.toString()) {
    throw new ForbiddenError(errorTextCannotDeleteMovie);
  }
};

// Проверяет наличие данных
const checkIsDataEmpty = (movie) => {
  if (!movie) { throw new NotFoundError(errorTextMovieNotFound); }
};

/** Находит все фильмы в базе данных и отправляет ответ */
module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .populate('owner')
    .then((movies) => res.status(200).send({ data: movies }))
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
    .then((movie) => res.status(200).send({ data: movie }))
    .catch((err) => { handleErrorMovieAlreadyExist(err, next); });
};

/** Находит фильм в базе данных по id и удаляет его */
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      checkIsDataEmpty(movie);
      checkUserIsOwnerMovie(movie, req);
      // Удаление фильма
      Movie.deleteOne({ _id: req.params.movieId })
        .then((data) => res.status(200).send({ data }))
        .catch(next);
    })
    .catch((err) => { handleErrorMovieNotFound(err, next); });
};
