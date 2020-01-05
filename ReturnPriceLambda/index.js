//const express = require('express')
//const app = express();

var mysql = require('mysql')
const request = require("request")
var config = require('config.json')

// AWS lambda portion
exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  // connecting to aws
  var con = mysql.createConnection({
    host:config.host,
    user: config.user,
    password: config.password
  })
  
  const address = event.address + " Canada"
  const APIKey = "AIzaSyC-Qkl1Z9leuVjF3wZTR7lvXH7KTbFnW74"
  
  request.post("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + APIKey, (error, res, body) => {
      
      // converting the result to a json object
      var result = JSON.parse(body)
      
      // getting the longitudes and latitudes
      var longitude = result.results[0].geometry.location.lng
      var latitude = result.results[0].geometry.location.lat
      
      var query = mysql.format("SELECT Price FROM RentalData.Data WHERE POWER(POWER(? - Longitude, 2) +  POWER(? - Latitude, 2), 0.5) < 0.13", [longitude, latitude])
      
      // checking connectiont to aws
      con.connect(function(err){
        con.query(query, function (err, result){
          con.end();
        
          if (err) throw err;
          // converting sql result into a json object
          callback(null, JSON.parse(JSON.stringify(result)))
        })
      })
    })
};
