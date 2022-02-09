const express = require('express');
const mongoose = require('mongoose');

// const cors = require('cors');

require('dotenv').config();

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

/** Валидация с помощью Joi/Celebrate */
const { errors } = require('celebrate');
const { validateSignupRoute, validateSigninRoute } = require('./validators/validatation-joi');

const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const { createUser, login, logout } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { errorTextServerError } = require('./utils/constants');
const { errorTextNonExistentRoute } = require('./utils/constants');
const { NotFoundError } = require('./errors/not-found-err');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

const PORT = 3000; // Нужно добавить в переменную окружения

mongoose.connect('mongodb://localhost:27017/bitfilmsdb')
  .then(() => console.log('Success: Database connected!'))
  .catch((err) => console.log(`Error: ${err}`));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/** Логи запросов */
app.use(requestLogger);

/** CORS */
// app.use(cors({
//   origin: '*',
//   methods: ['GET, HEAD, PUT, PATCH, POST, DELETE'],
//   preflightContinue: false,
//   optionsSuccessStatus: 204,
//   allowedHeaders: ['Content-type', 'origin', 'Authorization', 'Cookie'],
//   exposedHeaders: ['Set-Cookie'],
//   credentials: true,
// }));

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'https://praktikum.tk');
//   next();
// });

/** Роут регистрации пользователя */
app.post('/signup', validateSignupRoute(), createUser);

/** Роут авторизации пользователя */
app.post('/signin', validateSigninRoute(), login);

/** Защита роутов авторизацией */
app.use(auth);

app.use('/', usersRouter);
app.use('/', moviesRouter);

/** Роут для выхода пользователя из приложения */
app.post('/signout', logout);

// Обработка ошибки при переходе на несуществующий роут
app.use((req, res, next) => {
  next(new NotFoundError(errorTextNonExistentRoute));
});

/** Логи ошибок */
app.use(errorLogger);

/** Обработка ошибок celebrate */
app.use(errors());

/** Централизованная обработка ошибок */
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({ message: statusCode === 500 ? errorTextServerError : message });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
