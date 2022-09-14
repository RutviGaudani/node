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
//         const fileStorageEngine = multer.diskStorage({
//             destination:(req,file,cb)=>{
//               cb(null,'./images')
//             },
//             filename:(req,file,cb)=>{
//               cb(null,Date.now()+'--'+file.originalname)
//             }
//           });const upload =multer({storage:fileStorageEngine});
//           app.post("/single",upload.single("image"),(req,res)=>{
//             console.log(req.file);
//             res.send("file uploaded");
//           });

app.listen(3000, () => {

    console.log("server running on port:3000");
})
conn.on('open', () => {
    console.log("connected....");
})

// const xlsx = require('xlsx');
// const wb = xlsx.readFile("./data/1663128661324-customer.xlsx");
// console.log(wb.SheetNames);
// const ws = wb.Sheets['Sheet1'];
// //console.log(ws);

// const data =xlsx.utils.sheet_to_json(ws);
// console.log(data);