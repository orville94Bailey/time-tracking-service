var url = "mongodb://localhost:27017";
var MongoClient = require('mongodb').MongoClient;
var events = require('events');
var event = new events.EventEmitter();
var connection = null;

function connect(){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        connection = db.db('testApp');
        console.log('connected');
        event.emit('dbconnect');
    });
}

exports.get = function(fn) {
    if(connection !== null) {
        fn(connection);
    } else {
        connect();
        event.on('dbconnect', function(){
            fn(connection);
        })
    }
}