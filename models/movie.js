const mongoose = require('mongoose');
// Опишем схему:
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: String,
});

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);