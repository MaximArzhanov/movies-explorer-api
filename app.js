const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const cors = require('cors');

const {
  PORT = 3000,
  DB_CONN = 'mongodb://localhost:27017/moviesdb',
} = process.env;

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const { errors } = require('celebrate');
const { validateSignupRoute, validateSigninRoute } = require('./validators/validatation-joi');

const { handleErrorCentral } = require('./middlewares/handle-errors');

const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const { createUser, login, logout } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { errorTextNonExistentRoute } = require('./utils/constants');

const NotFoundError = require('./errors/not-found-err');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

mongoose.connect(DB_CONN)
  .then(() => console.log('Success: Database connected!'))
  .catch((err) => console.log(`Error: ${err}`));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/** Логи запросов */
app.use(requestLogger);

/** CORS */
app.use(cors({
  origin: '*',
  methods: ['GET, HEAD, PUT, PATCH, POST, DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-type', 'origin', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie'],
  credentials: true,
}));

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
app.use(handleErrorCentral);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
