var mysql = require("mysql");

let conn = mysql.createConnection({
    host: 'localhost', 
    user: 'root',
    password: '',
    database: 'UserDB' 
  });
  const { check } = require('express-validator');

  conn.connect(function(err) {
    if (err) throw err;
    console.log("Mysql database Connected!");
    // con.query("CREATE DATABASE mydb", function (err, result) {
    //   if (err) throw err;
    //   console.log("Database created");
    // });
  });

  module.exports=conn;