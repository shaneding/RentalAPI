var mysql = require("mysql")

exports.handler = (event, context, callback) => {
    
    // connecting to the sql database
    context.callbackWaitsForEmptyEventLoop = false;
    var con = mysql.createConnection({
      host:"practice.cdodof3lyshn.us-east-1.rds.amazonaws.com",
      user: "admin",
      password: "shane200195"
    })
    var query = mysql.format("INSERT INTO RentalData.Data (Price, Longitude, Latitude, Rooms) VALUES (?,?,?,?)", [event.price, event.longitude, event.latitude, event.rooms])
    // checking connectiont to aws
    con.connect(function(err){
      con.query(query, function (err, result){
        con.end();
      
        if (err) throw err;
        // converting sql result into a json object
        callback(null, JSON.parse(JSON.stringify(result)))
      })
    })
};