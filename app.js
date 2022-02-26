const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { handleErrorCentral } = require('./middlewares/handle-errors');
const auth = require('./middlewares/auth');
const { errorTextNonExistentRoute } = require('./utils/constants');
const { numberOfPort, dataBaseAddress } = require('./utils/config');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { logout } = require('./controllers/users');

const { PORT = numberOfPort, DB_CONN = dataBaseAddress } = process.env;

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
  origin: 'http://localhost:3000',
  methods: ['GET, HEAD, PUT, PATCH, POST, DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-type', 'origin', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie'],
}));

/** Роут регистрации пользователя */
app.use(require('./routes/sign'));

/** Роут авторизации пользователя */
app.use(require('./routes/sign'));

/** Защита роутов авторизацией */
app.use(auth);

app.use(require('./routes/users'));
app.use(require('./routes/movies'));

/** Роут для выхода пользователя из приложения */
app.use('/signout', logout);

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
