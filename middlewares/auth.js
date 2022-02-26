const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');
const { errorTextNeedAuthorization } = require('../utils/constants');
const { secretKeyDev } = require('../utils/config');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  // if (!req.cookies.jwt) { next(new UnauthorizedError(errorTextNeedAuthorization)); }
  // const token = req.cookies.jwt;

  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError(errorTextNeedAuthorization));
  }
  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : secretKeyDev);
  } catch (err) {
    return next(new UnauthorizedError(errorTextNeedAuthorization));
  }
  req.user = payload;
  return next();
};
