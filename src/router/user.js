const express = require("express");
const router = express.Router();

const usercontroller = require("../controllers/usercontroller");
const middleware = require("../middleware/auth");

module.exports = (app) =>{
  app.post('/upload',usercontroller.upload)
 //app.post('/upload',usercontroller.upload)
  app.post('/insert',usercontroller.insert)
  app.post('/login',usercontroller.login)
  app.get('/details',usercontroller.details)
  app.get('/querystringname',usercontroller.querystringname)
  app.get('/alldetails',usercontroller.alldetails)
  //app.get('/detail/:id',usercontroller.detail)
  app.patch('/update/:id',usercontroller.update)
  app.delete('/delete/:id',usercontroller.delete)
}