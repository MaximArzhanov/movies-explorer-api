const express = require('express');
const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const { createUser, login } = require('./controllers/users');

const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');

const app = express();

const PORT = 3000; // Нужно добавить в переменную окружения

mongoose.connect('mongodb://localhost:27017/bitfilmsdb')
  .then(() => console.log('Success: Database connected!'))
  .catch((err) => console.log(`Error: ${err}`));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/** Роут регистрации пользователя */
app.post('/signup', createUser);

/** Роут авторизации пользователя */
app.post('/signin', login);

app.use('/', usersRouter);
app.use('/', moviesRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
