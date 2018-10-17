var express = require('express')
var bodyParser = require('body-parser')
var connection = require('./database.js')

var app = express()
app.use(bodyParser.json())

app.get('/listUsers', function (req, res) {
  connection.get(function (client) {
    client.collection('users').find({}).toArray(function (err, result) {
      if (err) throw err
      res.end(JSON.stringify(result))
    })
  })
})

app.post('/addUser', function (req, res) {
  connection.get(function (client) {
    client.collection('users').insertOne(req.body.user, function (err, result) {
      if (err) throw err
      res.end('1 document inserted')
    })
  })
})

app.post('/timeEvent', function (req, res) {
  connection.get(function (client) {
    client.collection('timeEvents').insertOne(req.body.timeEvent, function (err, result) {
      if (err) throw err
      res.end('Time event added')
    })
  })
})

app.post('/authenticate', function (req, res) {
  console.log('request body', req.body)
  connection.get(function (client) {
    client.collection('users')
      .findOne({ 'name': req.body.username, 'password': req.body.password },
        function (err, result) {
          if (err) throw err
          delete result.password
          res.end(JSON.stringify(result))
        })
  })
})

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
})
