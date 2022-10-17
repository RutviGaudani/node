var mysql = require("mysql");
const conn = require("../config/conn");

   var Schema = `create table if not exists users(id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(255), email VARCHAR(255), phone_number BIGINT,age int,gender VARCHAR(255), photo VARCHAR(255),birth_date DATE, password VARCHAR(255))`;
   conn.query(Schema, function (err, result) {
    if (err) throw err;
    console.log("Table altered");
  });


const user_schema =function()
{
    this.name=user_schema.name;
    this.email=user_schema.email;
    this.phone_number=user_schema.phone_number; 
    this.age=user_schema.age;
    this.gender=user_schema.gender;
    this.photo=user_schema.photo;
    this.birth_date=user_schema.birth_date;
       

};
