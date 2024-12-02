// authMiddleware.js
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


function response(code,data,error) {
  if(code == 200){
    return {code, data }
  }
  return {code , error }
}

function authenticateToken(req, res, next) {
  var token = req.headers['authorization'];
  if (!token) return res.send(response(401, '', "Fill your token pls!"));
  token = token.split(' ')[1];
  jwt.verify(token, process.env.SECRETKEY, function (err, decoded) {
    if (err) { 
      return res.send(response(403, '', "Error token!.")); 
    } else {
      if (token === undefined) {
        return res.send(response(401, '', "Undefined Token!."));
      } else {
        req.body['decoded'] = decoded
        // console.log(decoded);
        next();
      }
    }
  });
}




module.exports = authenticateToken;
