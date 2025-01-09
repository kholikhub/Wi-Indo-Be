const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  // Import bcryptjs untuk hashing password

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },  // Menambahkan email untuk validasi lebih lanjut
  password: { type: String, required: true },
});

// Menggunakan middleware Mongoose untuk hash password sebelum menyimpannya
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();  // Jika password tidak diubah, lanjutkan

  try {
    const salt = await bcrypt.genSalt(10);  // Membuat salt untuk password
    this.password = await bcrypt.hash(this.password, salt);  // Hash password
    next();
  } catch (err) {
    next(err);
  }
});

// Method untuk memverifikasi password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);  // Membandingkan password yang dimasukkan dengan password hash
};

module.exports = mongoose.model('User', userSchema);
