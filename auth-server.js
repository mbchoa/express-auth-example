var session = require('express-session');
var redis = require('redis');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

var RedisStore = require('connect-redis')(session);
var app = express();

// setup middleware
app.use(require('morgan')('dev'));
app.use(bodyParser.json());
app.use(cors({
    credentials: true,
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

// setup routes
app.post('/login', function login (req, res, next) {
    if (!req.session.username) {
        console.log('Log in, start new sesion');
        req.session.username = req.body.username;
        return res.status(200).send('Logging in');
    } else {
        console.log('Already logged in!');
        return res.status(200).send('Already logged in!');
    }
});

// start server
var server = app.listen(4001, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Authentication Service started, listening at http://%s:%s', host, port);
});
