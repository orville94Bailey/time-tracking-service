var express = require('express');
var bodyParser = require('body-parser');
var connection = require('./database.js');
var mongodb = require('mongodb');

var app = express();
app.use(bodyParser.json())
var fs = require("fs");

app.get('/listUsers', function (req, res) {
   connection.get(function(client){
       client.collection('users').find({}).toArray(function(err, result){
          if (err) throw err;
          console.log(result);
          res.end(JSON.stringify(result));
       });
   });
})

app.get('/addUser', function(req,res){
    fs.readFile( __dirname + "/" + "users.json", "utf8", function (err, data) {
        data = JSON.parse(data);
        
        res.end( data );
    });
})
var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})