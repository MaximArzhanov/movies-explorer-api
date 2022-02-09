const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const {
  errorTextUserNotFound,
  errorTextUserAlreadyExist,
  errorTextWrongPasswordOrEmail,
} = require('../utils/constants');

const {
  checkIsDataEmpty,
  handleNotFoundError,
  handleDataAlreadyExistError,
  handleUnauthorizedError,
} = require('../utils/utils');

// Отправляет данные
const sendData = (user, res) => {
  checkIsDataEmpty(user, errorTextUserNotFound);
  res.status(200).send({ data: user });
};

// Отправляет данные без пароля
const sendDataWithoutPassword = (user, res) => {
  checkIsDataEmpty(user, errorTextUserNotFound);
  res.status(200).send({ data: { name: user.name, email: user.email } });
};

// Отправляет cookie
const sendCookie = (res, token) => {
  res
    .cookie('jwt', token, {
      maxAge: 3600000 * 24 * 365,
      httpOnly: true,
      // sameSite: 'none',
      // secure: true,
    })
    .status(200)
    .send({ data: 'Вход выполнен' });
};

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
    .catch((err) => { handleNotFoundError(err, next, errorTextUserNotFound); });
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
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      );
      sendCookie(res, token);
    })
    .catch((err) => { handleUnauthorizedError(err, next, errorTextWrongPasswordOrEmail); });
};

/** Выход пользователя из приложения */
module.exports.logout = (req, res, next) => {
  try {
    res
      .clearCookie('jwt')
      .status(200)
      .send({ data: 'токен успешно удалён' });
  } catch (err) {
    next(err);
  }
};
