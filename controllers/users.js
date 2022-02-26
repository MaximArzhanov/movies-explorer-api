const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const {
  errorTextUserNotFound,
  errorTextUserAlreadyExist,
  errorTextWrongPasswordOrEmail,
  // messageLoginCompleted,
  messageTokenWasDeleted,
} = require('../utils/constants');

const { secretKeyDev } = require('../utils/config');

const {
  checkIsDataEmpty,
  handleNotFoundError,
  handleDataAlreadyExistError,
  handleBadRequest,
} = require('../utils/utils');

// Отправляет данные
const sendData = (user, res) => {
  checkIsDataEmpty(user, errorTextUserNotFound);
  res.send({ data: user });
};

// Отправляет данные без пароля
const sendDataWithoutPassword = (user, res) => {
  checkIsDataEmpty(user, errorTextUserNotFound);
  res.send({ data: { name: user.name, email: user.email } });
};

// Отправляет cookie
// const sendCookie = (res, token) => {
//   res
//     .cookie('jwt', token, {
//       maxAge: 3600000 * 24 * 365,
//       httpOnly: true,
//       sameSite: 'none',
//       secure: true,
//     })
//     .send({ data: messageLoginCompleted });
// };

/** Возвращает информацию о текущем пользователе */
module.exports.getCurrentUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => { sendData(user, res); })
    .catch((err) => { handleNotFoundError(err, next, errorTextUserNotFound); });
};

/** Находит пользователя в базе данных по id, обновляет информацию  и отправляет ответ */
module.exports.updateUserInfo = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name,
    email: req.body.email,
  }, { new: true, runValidators: true })
    .then((user) => { sendData(user, res); })
    .catch((err) => {
      if (err.code === 11000) {
        handleDataAlreadyExistError(err, next, errorTextUserAlreadyExist);
      } else {
        handleNotFoundError(err, next, errorTextUserNotFound);
      }
    });
};

/** Создаёт пользователя в базе данных (Регистрация пользователя) */
module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash,
      })
        .then((user) => { sendDataWithoutPassword(user, res); })
        .catch((err) => { handleDataAlreadyExistError(err, next, errorTextUserAlreadyExist); });
    })
    .catch(next);
};

/** Авторизация пользователя */
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : secretKeyDev,
      );
      res.status(200).send({ jwt: token });
      // sendCookie(res, token);
    })
    .catch((err) => { handleBadRequest(err, next, errorTextWrongPasswordOrEmail); });
};

/** Выход пользователя из приложения */
module.exports.logout = (req, res, next) => {
  try {
    res.clearCookie('jwt').send({ data: messageTokenWasDeleted });
  } catch (err) {
    next(err);
  }
};
