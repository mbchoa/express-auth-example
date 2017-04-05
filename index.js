var session = require('express-session');
var redis = require('redis');

var RedisStore = require('connect-redis')(session);
var app = require('express')();

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
app.get('/', function initViewsCount (req, res, next) {
    if (typeof req.session.views === 'undefined') {
        req.session.views = 1;
        return res.send('Welcome to the files session demo.  Refresh page!');
    }
    next();
});

app.get('/', function incrementViewsCount (req, res, next) {
    req.session.views++;
    next();
});

app.get('/', function (req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.write('<p>views: ' + req.session.views + '</p>\n');
    res.send();
});

// start server
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
