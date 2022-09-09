const express = require("express");
const conn = require("../config/conn");
const user_schema = require("../model/user_schema");
const path = require("path");
const upload = require('express-fileupload');

var fs = require("fs");
const router = new express.Router();
const http = require("http");
const url = require("url");
const { check } = require('express-validator');
const auth=require("../middleware/auth");

const jsonwebtoken = require("jsonwebtoken");
require('dotenv').config();

const bcrypt = require('bcrypt');
const saltRounds = 10;

const signupValidation = require("../config/conn");
const jwt = require('jsonwebtoken');


http.createServer((req, res) => {
  // Parsing the URL
  var request = url.parse(req.url, true);

  // Extracting the path of file
  var action = request.pathname;

  // Path Refinements
  var filePath = path.join(__dirname,
    action).join(" ");

  // Checking if the path exists
  fs.exists(filePath, function (exists) {
    console.log("fetch image");
    if (!exists) {
      res.writeHead(404, {
        "Content-Type": "text/plain"
      });
      res.end("404 Not Found");
      return;
    }

    // Setting default Content-Type
    var contentType = "text/plain";

    // Setting the headers
    res.writeHead(200, {
      "Content-Type": contentType
    });

    // Reading the file
    fs.readFile(filePath,
      function (err, content) {
        // Serving the image
        res.end(content);
      });
  });
})
exports.upload = async function (req, res) {
  if (req.files) {
    console.log(req.files)
    var file = req.files.file;
    var filename = file.name;
    console.log(filename)
    file.mv('./upload/' + Date.now() + filename, function (err) {
      if (err) {
        res.send(err)
      } else {
        res.send("file uploaded")
      }
    })
  }
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
      //res.send(err, null);
      return;
    }
    console.log("created student: ");
    if (data.affectedRows == 1) {
      res.send(user_schema)
      console.log("sfsefewfw");
    } else {
      res.send('some error ocoure')
    }
    //res.send(data)

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

// exports.details = function (req, res) {
//   const token = req.headers["x-access-token"];
//   if (!token) {
//     res.send("We need a token, please give it to us next time");
//   } else {
//     jwt.verify(token, 'GKGKGKGK', (err, decoded) => {
//       if (err) {
//         console.log('err:' + err);
//         //  console.log(process.env.TOKEN_KEY);
//         res.json({ auth: false, message: "you are failed to authenticate" });
//       } else {
//         res.json({ user_id: decoded.user_id });
//         //req.user_schema = decoded;
//         // console.log("Token match:" + JSON.stringify(decoded.user_id));

//         res.end();
//       }
//     });
//   }
// }
exports.details= auth,(req,res)=>{

  res.status(200).send("");
}
//querystring
exports.alldetails =  async function (req, res) {

  var id = req.query.id;
  var name = req.query.name;
  conn.query(`select * from customers where id='${id}'`,(err,data)=>{
 // conn.query(`SELECT  '${id}','${name}' from customers`, (err, data) => {
    console.log(data);
    if (err) throw (err);
    res.send(data);
  })
  console.log('name: ' + req.query.id)
  //  res.send(user_schema);
};

//   exports.detail = function (req, res) {
//   let id = req.params.id;
//   if (!id) {
//     return res.status(400).send({ error: true, message: 'Please provide user_id' });
//   }
//   conn.query('SELECT * FROM customers where id=?', id, function (error, results, fields) {
//     if (error) throw error;
//     return res.send({ error: false, data: results[0], message: 'customers list.' });
//   });
// };
exports.querystringname=async function(req, res){
  var id =req.query.id;
  var name=req.query.name;
    conn.query(`select '${id}','${name}' from customers`,(err,data)=>{
        console.log(data);
        if(err)throw(err);
        res.send(data);
    })
    console.log('name:'+req.query.id);
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

