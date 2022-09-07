const express= require("express");
const app = express();
// const multer = require("multer");
// var bodyParser = require('body-parser');

// sqlSchema = require("./model/user_schema");
var router = express.Router();
app.use(express.urlencoded({extended:false}));

require("./router/user")(app)

app.use(express.json());

const userrouter = require("./router/user")

app.use(express.static('public')); 
app.use('/upload', express.static('upload'));

app.listen(3000,()=>{

    console.log("server running on port:3000");
})

let mysql=require("mysql");
const conn = require("./config/conn");

conn.on('open',()=>{
    console.log("connected....");
})

