const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();  // Memuat file .env

// Import routes
const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');

const app = express();

// Middleware
app.use(cors());  // Mengizinkan CORS untuk akses dari domain lain
app.use(express.json());  // Agar Express bisa membaca body JSON

// Koneksi ke MongoDB menggunakan URI yang disimpan di file .env
mongoose
  .connect(process.env.MONGO_URI)  // Hapus opsi useNewUrlParser dan useUnifiedTopology
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Menggunakan routes yang telah diimport
app.use('/api/auth', authRoutes);  // Route untuk authentication
app.use('/api/content', contentRoutes);  // Route untuk konten

// Menyajikan file statis seperti gambar yang diupload
app.use('/uploads', express.static('uploads'));

// Menentukan port dari environment variable atau port default 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
