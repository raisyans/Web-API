const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: String, // Nama file gambar
  file: String,  // Nama file lainnya
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Todo', todoSchema);