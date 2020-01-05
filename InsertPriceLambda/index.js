var mysql = require("mysql")
const request = require("request")
var config = require('config.json')

// AWS Lambda Section
exports.handler = (event, context, callback) => {
    
    // connecting to the sql database
    context.callbackWaitsForEmptyEventLoop = false;
    var con = mysql.createConnection({
      host:config.host,
      user: config.user,
      password: config.password
    })

    // variables required for the http POST request
    const address = event.address + " Canada"
    const APIKey = "AIzaSyC-Qkl1Z9leuVjF3wZTR7lvXH7KTbFnW74"
    // making the http post request
    request.post("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + APIKey, (error, res, body) => {
      
      // converting the result to a json object
      var result = JSON.parse(body)
      
      // getting the longitudes and latitudes
      var longitude = result.results[0].geometry.location.lng
      var latitude = result.results[0].geometry.location.lat
      
      var query = mysql.format("INSERT INTO RentalData.Data (Price, Longitude, Latitude, Rooms) VALUES (?,?,?,?)", [event.price, longitude, latitude, event.rooms])
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