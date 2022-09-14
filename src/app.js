const express = require("express");
const app = express();
const conn = require("./config/conn");
sqlSchema = require("./model/user_schema");
var router = express.Router();
app.use(express.urlencoded({ extended: true }));

require("./router/user")(app)
require("./middleware/auth")

app.use(express.json());

const userrouter = require("./router/user")

app.use(express.static('public'));
app.set('view engine', 'ejs');
//const upload = require('express-fileupload');
//app.use('/upload', express.static('upload'));
//app.use(upload())
app.listen(3000, () => {

    console.log("server running on port:3000");
})
conn.on('open', () => {
    console.log("connected....");
})

