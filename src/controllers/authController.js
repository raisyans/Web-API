const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Todo = require('../models/Todo');

exports.register = async (req, res) => {
  try {
    // Dapatkan data dari body request
    const { username, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat pengguna baru
    const newUser = new User({
      username: username,
      password: hashedPassword,
    });

    // Simpan pengguna ke database
    const savedUser = await newUser.save();

    // Buat token JWT untuk pengguna yang baru terdaftar
    const token = jwt.sign({ userId: savedUser._id }, 'your-secret-key', { expiresIn: '1h' });

    res.status(201).json({ token, userId: savedUser._id, username: savedUser.username });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.login = async (req, res) => {
  try {
    // Dapatkan data dari body request
    const { username, password } = req.body;

    // Cari pengguna berdasarkan nama pengguna
    const user = await User.findOne({ username });

    // Periksa apakah pengguna ditemukan dan kata sandi sesuai
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Buat token JWT untuk pengguna yang berhasil login
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });

    res.status(200).json({ token, userId: user._id, username: user.username });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Fungsi untuk membuat Todo
exports.createTodo = async (req, res) => {
  try {
    // Dapatkan data dari body request
    const { title, description } = req.body;

    // Dapatkan userId dari req.user yang telah diatur oleh middleware verifyToken
    const userId = req.user.userId;

    // Buat todo baru
    const newTodo = new Todo({
      title: title,
      description: description,
      userId: userId,
    });

    // Simpan todo ke database
    const savedTodo = await newTodo.save();

    res.status(201).json(savedTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
