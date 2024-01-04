const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  // Dapatkan token dari header permintaan
  const token = req.header('Authorization');

  // Periksa apakah token ada
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verifikasi token menggunakan secret key
    const decoded = jwt.verify(token, 'your-secret-key'); // Ganti 'your-secret-key' dengan secret key Anda

    // Setel data pengguna yang terverifikasi ke req.user
    req.user = decoded;

    // Lanjutkan ke middleware atau handler berikutnya
    next();
  } catch (error) {
    // Tangani kesalahan jika token tidak valid
    return res.status(401).json({ message: 'Invalid token.' });
  }
};
