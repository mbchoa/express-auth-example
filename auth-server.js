var session = require('express-session');
var redis = require('redis');
var express = require('express');
var cors = require('cors');

var RedisStore = require('connect-redis')(session);
var app = express();

// setup middleware
app.use(require('morgan')('dev'));
app.use(cors({
    origin: 'http://localhost:4000'
}));
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
app.post('/login', function login (req, res, next) {
    console.log('Posted login');
    if (!req.session.views) req.session.views = 0;
    req.session.views++;
    res.status(200).send();
});

// start server
var server = app.listen(4001, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Authentication Service started, listening at http://%s:%s', host, port);
});
