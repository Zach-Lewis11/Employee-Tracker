const mysql = require('mysql2');

require('dotenv').config();

const connection = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  port: 3306
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!")
});

module.exports = connection