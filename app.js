const express = require('express');
const app = express();

const PORT = 3000; // Нужно добавить в переменную окружения

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});