const { errorTextNonExistentRoute } = require('../utils/constants');
const { NotFoundError } = require('../errors/not-found-err');

const nonExistentRoute = (req, res, next) => {
  next(new NotFoundError(errorTextNonExistentRoute));
};

module.exports = {
  nonExistentRoute,
};
