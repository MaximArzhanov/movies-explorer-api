const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');
const UnauthorizedError = require('../errors/unauthorized-err');

const { errorTextUserNotFound } = require('./constants');

// Проверяет наличие данных
const checkIsDataEmpty = (data) => {
  if (!data) { throw new NotFoundError(errorTextUserNotFound); }
};

// Обработка ошибки NotFoundError
const handleNotFoundError = (err, next, errorText) => {
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    next(new NotFoundError(errorText));
  } else {
    next(err);
  }
};

// Обработка ошибки DataAlreadyExist
const handleDataAlreadyExistError = (err, next, errorText) => {
  if (err.code === 11000) {
    next(new ConflictError(errorText));
  } else {
    next(err);
  }
};

// Обработка ошибки UnauthorizedError
const handleUnauthorizedError = (err, next, errorText) => {
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    next(new UnauthorizedError(errorText));
  } else {
    next(err);
  }
};

module.exports = {
  checkIsDataEmpty,
  handleNotFoundError,
  handleDataAlreadyExistError,
  handleUnauthorizedError,
};
