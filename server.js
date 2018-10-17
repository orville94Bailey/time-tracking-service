var express = require('express');
var bodyParser = require('body-parser');
var connection = require('./database.js');
var mongodb = require('mongodb');

var app = express();
// app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
var fs = require("fs");

function getNextSequence(name){
    var ret = connection.get(function(client){
        client.collection('counters').findAndModify({
            query:{_id:name},
            update:{$inc:{seq:1}},
            new:true
        });
        return ret.seq;
    })
}

app.get('/listUsers', function (req, res) {
   connection.get(function(client){
       client.collection('users').find({}).toArray(function(err, result){
          if (err) throw err;
          res.end(JSON.stringify(result));
       });
   });
})

app.post('/addUser', function(req,res){
    connection.get(function(client){
        client.collection('users').insertOne(req.body.user, function(err,result){
           if (err) throw err;
           res.end("1 document inserted"); 
        })
    });
});


var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})