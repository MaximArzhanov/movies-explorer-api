const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost:27017/mongodb')
  .then(() => console.log('Success: Database connected!'))
  .catch((err) => console.log(`Error: ${err}`));

const PORT = 3000; // Нужно добавить в переменную окружения

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
