const express = require('express');
const mongoose = require('mongoose');

const { createUser } = require('./controllers/users');

const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');

const app = express();

const PORT = 3000; // Нужно добавить в переменную окружения

mongoose.connect('mongodb://localhost:27017/bitfilmsdb')
  .then(() => console.log('Success: Database connected!'))
  .catch((err) => console.log(`Error: ${err}`));

/** Роут регистрации пользователя */
app.post('/signup', createUser);

app.use('/', usersRouter);
app.use('/', moviesRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
