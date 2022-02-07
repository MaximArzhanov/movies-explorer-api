const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { errorTextUserNotFound, errorTextUserAlreadyExist } = require('../utils/constants');
const { NotFoundError, ConflictError } = require('../errors/not-found-err');

// Обработка ошибки userAlreadyExist
const handleErrorUserAlreadyExist = (err, next) => {
  if (err.code === 11000) {
    next(new ConflictError(errorTextUserAlreadyExist));
  } else {
    next(err);
  }
};

// Обработка ошибки userNotFound
const handleErrorUserNotFound = (err, next) => {
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    next(new NotFoundError(errorTextUserNotFound));
  } else {
    next(err);
  }
};

// Проверяет наличие данных
const checkIsDataEmpty = (user) => {
  if (!user) { throw new NotFoundError(errorTextUserNotFound); }
};

// Отправляет данные
const sendData = (user, res) => {
  checkIsDataEmpty(user);
  res.status(200).send({ data: user });
};

// Отправляет данные без пароля
const sendDataWithoutPassword = (user, res) => {
  checkIsDataEmpty(user);
  res.status(200).send({ data: { name: user.name, email: user.email } });
};

/** Возвращает информацию о текущем пользователе */
module.exports.getCurrentUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => { sendData(user, res); })
    .catch((err) => { handleErrorUserNotFound(err, next); });
};

/** Находит пользователя в базе данных по id, обновляет информацию  и отправляет ответ */
module.exports.updateUserInfo = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name,
    about: req.body.about,
  }, { new: true, runValidators: true })
    .then((user) => { sendData(user, res); })
    .catch((err) => { handleErrorUserNotFound(err, next); });
};

/** Создаёт пользователя в базе данных */
module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash,
      })
        .then((user) => { sendDataWithoutPassword(user, res); })
        .catch((err) => { handleErrorUserAlreadyExist(err, next); });
    })
    .catch(next);
};
