var session = require('express-session');
var redis = require('redis');
var express = require('express');

var RedisStore = require('connect-redis')(session);
var app = express();

// setup middleware
app.use(require('morgan')('dev'));
app.use(session({
    name: 'server-session-cookie-id',
    secret: 'my secret',
    saveUninitialized: false,
    resave: false,
    store: new RedisStore({
        client: redis.createClient(),
        host: 'localhost',
        port: 6379,
    }),
}));

app.use(function printSession (req, res, next) {
    console.log('req.session', req.session);
    next();
});

// setup routes
app.get('/', function sendIndex (req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/login', function login (req, res, next) {
    if (!req.session.views) req.session.views = 0;
    req.session.views++;
    res.status(200).send();
});

// start server
var server = app.listen(4000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
