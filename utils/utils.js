const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const BadRequestError = require('../errors/bad-request-err');

// Проверяет наличие данных
const checkIsDataEmpty = (data, errorText) => {
  if (!data) { throw new NotFoundError(errorText); }
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

// Обработка ошибки BadRequest
const handleBadRequest = (err, next, errorText) => {
  next(new BadRequestError(errorText));
};

module.exports = {
  checkIsDataEmpty,
  handleNotFoundError,
  handleDataAlreadyExistError,
  handleUnauthorizedError,
  handleBadRequest,
};
