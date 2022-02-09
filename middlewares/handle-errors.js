const { errorTextServerError } = require('../utils/constants');

const handleErrorCentral = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({ message: statusCode === 500 ? errorTextServerError : message });
};

module.exports = { handleErrorCentral };
