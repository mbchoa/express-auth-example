var express = require('express');

var app = express();

// setup middleware
app.use(require('morgan')('dev'));

// setup routes
app.get('/', function sendIndex (req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

// start server
var server = app.listen(4000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Express Server started, listening at http://%s:%s', host, port);
});
