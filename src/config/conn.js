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
  });

  module.exports=conn;