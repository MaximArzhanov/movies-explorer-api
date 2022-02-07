const Movie = require('../models/movie');
const { errorTextMovieNotFound, errorTextCannotDeleteMovie } = require('../utils/constants');

const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

// Обработка ошибок
const handleErrorUserNotFound = (err, next) => {
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
  // const {
  //   country,
  //   director,
  //   duration,
  //   year,
  //   description,
  //   image,
  //   trailer,
  //   nameRU,
  //   nameEN,
  //   thumbnail,
  //   movieId,
  // } = req.body;
  Movie.create({
    country: req.body.country,
    director: req.body.director,
    duration: req.body.duration,
    year: req.body.year,
    description: req.body.description,
    image: req.body.image,
    trailer: req.body.trailer,
    nameRU: req.body.nameRU,
    nameEN: req.body.nameEN,
    thumbnail: req.body.thumbnail,
    movieId: req.body.movieId,
    owner: req.user._id,
  })
    .then((card) => res.status(200).send({ data: card }))
    .catch(next);
};

/** Находит фильм в базе данных по id и удаляет его */
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.cardId)
    .then((movie) => {
      checkIsDataEmpty(movie);
      checkUserIsOwnerMovie(movie, req);
      // Удаление фильма
      Movie.deleteOne({ _id: req.params.cardId })
        .then((data) => res.status(200).send({ data }))
        .catch(next);
    })
    .catch((err) => { handleErrorUserNotFound(err, next); });
};
