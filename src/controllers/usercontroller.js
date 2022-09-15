const express = require("express");
const conn = require("../config/conn");
const user_schema = require("../model/user_schema");
const path = require("path");
const multer = require('multer');
var fs = require("fs");
const router = new express.Router();
const http = require("http");
const url = require("url");
const { check } = require('express-validator');
const auth = require("../middleware/auth");
const jsonwebtoken = require("jsonwebtoken");
require('dotenv').config();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const signupValidation = require("../config/conn");
const jwt = require('jsonwebtoken');

// const xlsx = require('xlsx');

// //const wb = xlsx.readFile("./data/1663128661324-customer.xlsx",{cellDates:true});
// const wb = xlsx.readFile("./data/1663128661324-customer.xlsx", { dateNF: "DD/MM/YY" });
// console.log(wb.SheetNames);
// const ws = wb.Sheets['Sheet1'];
// //console.log(ws);
// const data = xlsx.utils.sheet_to_json(ws, { raw: false });
// console.log(data);
// let newData = [];
// newData = data.map((d) => {
//   if (d.paid == "TRUE") d.paid = true;
//   if (d.paid == "FALSE") d.paid = false;
//   return d;
// 


//uplaod excel using auth midddleware   
exports.excel = auth, (req, res) => {
  res.status(200).send("");
}
//uplaod image
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // iamges is the Upload_folder_name
    cb(null, "images")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  }
})
var Uploads = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {

    // Set the filetypes, it is optional
    var filetypes = /jpeg|jpg|png/;
    var mimetype = filetypes.test(file.mimetype);

    var extname = filetypes.test(path.extname(
      file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }

    cb("Error: File upload only supports the "
      + "following filetypes - " + filetypes);
  }
}).single("file");

exports.image = function (req, res, next) {
  Uploads(req, res, function (err) {
    if (err) {
      res.send(err)
    }
    else {
      res.send("Success, Image uploaded!")
    }
  })
}
exports.insert = async function (req, res) {
  const password = req.body.password;
  const encryptedPassword = await bcrypt.hash(password, saltRounds)
  var user_schema = {
    name: req.body.name,
    email: req.body.email,
    phone_number: req.body.phone_number,
    age: req.body.age,
    gender: req.body.gender,
    photo: req.body.photo,
    birth_date: req.body.birth_date,
    password: encryptedPassword
  }
  conn.query(`INSERT INTO customers (name, email, phone_number, age , gender ,photo, birth_date,password) VALUES ('${user_schema.name}','${user_schema.email}','${user_schema.phone_number}','${user_schema.age}','${user_schema.gender}','${user_schema.photo}','${user_schema.birth_date}','${user_schema.password}')`, (err, data) => {
    if (err) {
      console.log("error: ", err);

      return;
    }
    console.log("created student: ");
    if (data.affectedRows == 1) {
      res.send(user_schema)
      console.log("sfsefewfw");
    } else {
      res.send('some error ocoure')
    }
  });
};
exports.login = function (request, response) {
  var email = request.body.email;
  var password = request.body.password;
  if (email) {
    conn.query('SELECT * FROM customers WHERE email = ? ', [email], async function (error, results, fields) {
      console.log(results);
      if (results && results.length > 0) {
        //  console.log('password' + password);
        // console.log('results.password' + results[0].password);
        let matchPassword = await bcrypt.compare(password, results[0].password);
        if (matchPassword) {

          const jsontoken = jsonwebtoken.sign({ user_id: results[0].id }, 'GKGKGKGK');
          response.json({ token: jsontoken });
          //request.session.login = true;
          //request.session.email = email;
          // response.send("login successfully!!!!")
        } else {
          response.send('Incorrect password!');
        }
      } else {
        response.send('Incorrect email!');
      }
      response.end();
    });
  } else {
    response.send('Please enter email and Password!');
    response.end();
  }
};
// get all user
exports.all= function (req,res)  {
  let sqlquery=`select * from customers`;
  conn.query(sqlquery,function(error,result,fields){

  if (error) throw error;
  res.send(result);
  //res.status(200).json(result);
  //console.log("check you got it");
  });

}

//verify token using middelware
exports.details = auth, (req, res) => {
  res.status(200).send("");
}
//querystring
exports.alldetails = async function (req, res) {
  var id = req.query.id;
  var name = req.query.name;
  conn.query(`select * from customers where id='${id}'`, (err, data) => {
    console.log(data);
    if (err) throw (err);
    res.send(data);
  })
  console.log('name: ' + req.query.id)
  //  res.send(user_schema);
};

exports.querystringname = async function (req, res) {
  var id = req.query.id;
  var name = req.query.name;
  conn.query(`select '${id}','${name}' from customers`, (err, data) => {
    console.log(data);
    if (err) throw (err);
    res.send(data);
  })
  console.log('name:' + req.query.id);
}
exports.update = function (req, res) {
  let id = req.params.id;
  let birth_date = req.body.birth_date;
  if (!id || !birth_date) {
    return res.status(400).send({ message: 'Please provide user and id' });
  }
  conn.query("UPDATE customers SET birth_date = ? WHERE id = ?", [birth_date, id], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'customers has been updated successfully.' });
  });
};
exports.delete = function (req, res) {
  let id = req.params.id;
  if (!id) {
    return res.status(400).send({ error: true, message: 'Please provide user_id' });
  }
  conn.query('DELETE FROM customers WHERE id = ?', [id], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'User has been updated successfully.' });
  });
};

