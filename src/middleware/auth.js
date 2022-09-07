const jwt = require("jsonwebtoken");

exports.details = function (req, res) {
    const token = req.headers["x-access-token"];
    if (!token) {
      res.send("We need a token, please give it to us next time");
    } else {
      jwt.verify(token, 'GKGKGKGK', (err, decoded) => {
        if (err) {
          console.log('err:' + err);
          //  console.log(process.env.TOKEN_KEY);
          res.json({ auth: false, message: "you are failed to authenticate" });
        } else {
          res.json({ user_id: decoded.user_id });
          //req.user_schema = decoded;
          // console.log("Token match:" + JSON.stringify(decoded.user_id));
  
          res.end();
        }
      });
    }
  }