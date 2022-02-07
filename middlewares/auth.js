const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');
const { errorTextNeedAuthorization } = require('../utils/constants');

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) { next(new UnauthorizedError(errorTextNeedAuthorization)); }
  const token = req.cookies.jwt;

  let payload;
  try {
    payload = jwt.verify(token, 'RsZNpZ6yARkdc66');
  } catch (err) {
    return next(new UnauthorizedError(errorTextNeedAuthorization));
  }
  req.user = payload;
  return next();
};
