const User = require('../models/user');
const { errorTextUserNotFound } = require('../utils/constants');
const NotFoundError = require('../errors/not-found-err');

// Обработка ошибок
const handleError = (err, next) => {
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    next(new NotFoundError(errorTextUserNotFound));
  } else {
    next(err);
  }
};

// Проверяет наличие данных
const checkDataEmpty = (user) => {
  if (!user) { throw new NotFoundError(errorTextUserNotFound); }
};

// Отправляет данные
const sendData = (user, res) => {
  checkDataEmpty(user);
  res.status(200).send({ data: user });
};

/** Возвращает информацию о текущем пользователе */
module.exports.getCurrentUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => { sendData(user, res); })
    .catch((err) => { handleError(err, next); });
};

/** Находит пользователя в базе данных по id, обновляет информацию  и отправляет ответ */
module.exports.updateUserInfo = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name,
    about: req.body.about,
  }, { new: true, runValidators: true })
    .then((user) => { sendData(user, res); })
    .catch((err) => { handleError(err, next); });
};
