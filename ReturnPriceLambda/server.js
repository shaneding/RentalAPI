const express = require('express')
const app = express();

var mysql = require('mysql')

// connecting to mysql database
var con = mysql.createConnection({
  host:"practice.cdodof3lyshn.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "shane200195"
})

// checking connectiont to aws
con.connect(function(err){
  if (err){
    throw err
  }else{
    console.log("Successfully connected")
  }

})

app.get('/insert', (req, res)=> {
  con.query("INSERT INTO test.practice (`Name`, `Age`) VALUES ('User 4', '22')", function (err, result){
    if (err) throw err;
    res.send(JSON.parse(JSON.stringify(result)))
  })
})

app.get('/', (req, res) => {
  con.query("SELECT * FROM test.practice", function (err, result){
    if (err) throw err;

    // converting sql result into a json object
    res.send(JSON.parse(JSON.stringify(result)))
  })
});

app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
});