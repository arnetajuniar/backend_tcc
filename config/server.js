const express = require('express');
const app = express();

// Middleware untuk mengizinkan permintaan dari frontend yang berbeda domain
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Route untuk permintaan dari frontend
app.get('/api/data', (req, res) => {
  // Lakukan operasi yang diperlukan (misalnya, akses database) dan kirimkan respons ke frontend
  res.json({ message: 'Data from backend' });
});


app.listen(8000)
