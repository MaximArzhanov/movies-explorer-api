const { errorTextNonExistentRoute } = require('../utils/constants');
const { NotFoundError } = require('../errors/not-found-err');

const nonExistantRoute = (req, res, next) => {
  next(new NotFoundError(errorTextNonExistentRoute));
};

module.exports = {
  nonExistantRoute,
};
