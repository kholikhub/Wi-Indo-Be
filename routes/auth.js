const express = require('express');
const jwt = require('jsonwebtoken');  // Import jsonwebtoken untuk membuat token
const User = require('../models/User');  // Mengimpor model User
require('dotenv').config();  // Memuat konfigurasi dari file .env

const router = express.Router();

// Endpoint untuk registrasi
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Cek apakah user sudah ada
    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
      return res.status(400).json({ message: 'Username atau Email sudah terdaftar' });
    }

    // Membuat user baru
    const user = new User({
      username,
      email,
      password,
    });

    // Menyimpan user ke MongoDB
    await user.save();

    // Kirim response sukses
    res.status(201).json({ message: 'User berhasil didaftarkan' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan saat registrasi' });
  }
});

// Endpoint untuk login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Cek apakah user ada
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'User tidak ditemukan' });
    }

    // Verifikasi password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password salah' });
    }

    // Membuat payload untuk token JWT
    const payload = {
      userId: user._id,
      username: user.username,
    };

    // Membuat token JWT, valid untuk 1 jam
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Kirim respons sukses jika login berhasil
    res.status(200).json({
      message: 'Login berhasil',
      token,  // Token ditambahkan ke response
      user: {
        username: user.username,
        email: user.email,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan saat login' });
  }
});

module.exports = router;
