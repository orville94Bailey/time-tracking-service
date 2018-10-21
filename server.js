var express = require('express')
var bodyParser = require('body-parser')
var connection = require('./database.js')

var app = express()
app.use(bodyParser.json())
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

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
  console.log('inserting event')
  console.log(req.body)
  connection.get(function (client) {
    client.collection('timeEvents').insertOne(req.body, function (err, result) {
      if (err) throw err
      res.end('Time event added')
    })
  })
})

app.get('/userEvents', function (req, res) {
  console.log('sending events')
  connection.get(function (client) {
    var timeEvents = client.collection('timeEvents').find({ 'user': req.query.id })
      .toArray()
    console.log(timeEvents)
    res.end(JSON.stringify(timeEvents))
  })
})

app.post('/authenticate', function (req, res) {
  console.log('attempting auth')
  console.log('request body', req.body)
  connection.get(function (client) {
    client.collection('users')
      .findOne({ 'name': req.body.username, 'password': req.body.password },
        function (err, result) {
          if (err) {
            res.end(JSON.stringify({ success: false, message: 'Error talking to db' }))
          } else {
            if (result !== null) {
              result.success = true
              delete result.password
              console.log(result)
              res.end(JSON.stringify(result))
            } else {
              res.end(JSON.stringify({ success: false, message: 'Invalid username or password.' }))
            }
          }
        })
  })
})

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
})
