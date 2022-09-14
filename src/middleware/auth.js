const jwt = require("jsonwebtoken");
const multer = require("multer");
const verifyToken = function (req, res) {
    const token = req.headers["x-access-token"];
    if (!token) {
      res.send("We need a token, please give it to us next time");
    } else {
      jwt.verify(token, 'GKGKGKGK', (err, decoded) => {
        if (err) {
          console.log('err:' + err);
          //  console.log(process.env.TOKEN_KEY);
          res.json({ auth: false, message: "not authenticate" });
        } else {
          res.json({ user_id: decoded.user_id });
          //req.user_schema = decoded;
           //console.log("Token match:" + JSON.stringify(decoded.user_id));
  res.end();
          }
      });
    }
  }
  const uploadXLSX =  function (req, res) {
    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "data");
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
      },
    });
  var excelfile = multer({ 
    storage: storage,
    }).single("excel");       
  excelfile(req,res,function(err) {
  if(err) {
        res.send(err)
    }
    else {
        res.send("Success, file uploaded!")
    }
  })
}

module.exports=verifyToken;
module.exports=uploadXLSX;