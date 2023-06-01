const express = require('express');
const app = express();
const conn = require('./config/db');

app.use(express.json());
app.get('/get-mahasiswa', function (req, res){
    const queryStr = "SELECT id, nim, jurusan FROM mahasiswa WHERE deleted_at IS NULL "
    conn.query(queryStr, (err, results) => {
        if (err){
            console.log(err);
            res.errored(err.sqlMessage, res);
        } else{
            res.send(results);
            console.log(results);
        }

    });

})

app.post('/post-mahasiswa', function (req, res){
    console.log(req.body);
    const param = req.body;
    const nim = param.nim;
    const jurusan = param.jurusan;
    const now = new Date();

    const queryStr = "INSERT INTO mahasiswa (nim, jurusan, created_at) VALUES (?, ?, ?)";
    const values = [nim, jurusan, now];

    conn.query(queryStr, values, (err, results) => {
        if (err){
            console.log(err);
            res.status(500).json({
                "sucsess": false,
                "message": err.sqlMessage,
                "data": null
            });
        }else {
            res.send(results);
            console.log(results);
        }
    })
})

app.put('/update-mahasiswa', function (req, res){
    const param = req.body;
    const id = param.id;
    const nim = param.nim;
    const jurusan = param.jurusan;

    const queryStr = "UPDATE mahasiswa SET nim = ?, jurusan = ? WHERE id = ? AND deleted_at IS NULL";
    const values = [nim, jurusan, id];

    conn.query(queryStr, values, (err, results) => {
        if (err){
            console.log(err);
            res.status(500).json({
                "sucsess": false,
                "message": err.sqlMessage,
                "data": null
            });
        } else {
            res.send(results);
            console.log(results);
        }
    })
})

app.delete('/delete-mahasiswa', function (req, res){
    const param = req.body;
    const id = param.id;
    const now = new Date();

    const queryStr = "UPDATE mahasiswa SET deleted_at = ? WHERE id = ?";
    const values = [now, id ];

    conn.query(queryStr, values, (err, results) => {
        if (err){
            console.log(err);
            res.status(500).send(
                "Gagal menghapus data!"
            );
        } else {
            res.send("Berhasil menghapus data");
            console.log(results);
        }
    })
})

//user

app.post('/post-user', function (req, res){
    console.log(req.body);
    const param = req.body;
    const username = param.username;
    const password = param.password;
    const now = new Date();

    const queryStr = "INSERT INTO user (username, password, created_at) VALUES (?, ?, ?)";
    const values = [username, password, now];

    conn.query(queryStr, values, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send("Gagal menambahkan pengguna.");
          } else {
            console.log(results);
            res.send("Pengguna berhasil ditambahkan.");
            res.status(200).json({
              "sucsess": true,
              "message": "Berhasil",
              "data": null
          });
          }
    })
})

app.post('/checkUsername', (req, res) => {
    const userName = req.body.username;
    const sqlQuery = "SELECT username, password FROM user WHERE username = ?";
    conn.query(sqlQuery, [userName], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Terjadi kesalahan dalam memeriksa username.");
      } else {
        if (result.length > 0) {
          // Username telah ada dalam database
          res.json({ exists: true });
        } else {
          // Username belum ada dalam database
          res.json({ exists: false });
        }
      }
    });
  });

app.get('/get-user', function (req, res){
    const queryStr = "SELECT username, password FROM user WHERE deleted_at IS NULL "
    conn.query(queryStr, (err, results) => {
      if (err){
        console.log(err);
        res.errored(err.sqlMessage, res);
    } else{
        res.send(results);
        console.log(results);
    }
    });
})

app.put('/update-user', function (req, res){
    const param = req.body;
    const id = param.id;
    const username = param.username;
    const password = param.password;

    const queryStr = "UPDATE user SET username = ?, password = ? WHERE id = ? AND deleted_at IS NULL";
    const values = [username, password, id];

    conn.query(queryStr, values, (err, results) => {
        if (err){
            console.log(err);
            res.status(500).json({
                "sucsess": false,
                "message": err.sqlMessage,
                "data": null
            });
        } else {
            res.send(results);
            console.log(results);
        }
    })
})

app.delete('/delete-user', function (req, res){
    const param = req.body;
    const id = param.id;
    const now = new Date();

    const queryStr = "UPDATE user SET deleted_at = ? WHERE id = ?";
    const values = [now, id ];

    conn.query(queryStr, values, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send("Gagal menghapus user.");
          } else {
            console.log(results);
            res.send("User berhasil dihapus.");
          }
    })
})

app.post('/userLogin', (req, res) => {
  const userName = req.body.username;
  const userPassword = req.body.password;

  const sqlQuery = "SELECT username, password FROM user WHERE username = ?";
  conn.query(sqlQuery, [userName], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Terjadi kesalahan saat login.");
    } else {
      if (result.length > 0) {
        // Verifikasi kata sandi
        const storedPassword = result[0].password;
        if (userPassword === storedPassword) {
          // Login berhasil
          res.send("Login berhasil.");
        } else {
          // Kata sandi salah
          res.status(401).send("Kata sandi salah.");
        }
      } else {
        // Pengguna tidak ditemukan
        res.status(404).send("Pengguna tidak ditemukan.");
      }
    }
  });
});

app.listen(3000, () => {
    console.log('server berhasil berjalan pada port 3000!');
  });