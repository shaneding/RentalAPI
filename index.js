//const express = require('express')
//const app = express();

var mysql = require('mysql')

// AWS lambda portion
exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  var con = mysql.createConnection({
    host:"practice.cdodof3lyshn.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "shane200195"
  })
  // checking connectiont to aws
  con.connect(function(err){
    con.query("SELECT * FROM test.practice", function (err, result){
      con.end();
      
      if (err) throw err;
      // converting sql result into a json object
      callback(null, JSON.parse(JSON.stringify(result)))
    })
  })
};
