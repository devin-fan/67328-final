var express = require('express')
    , app = express()
    , fs = require('fs')
    , server = require('http').createServer(app)
    , bodyParser = require('body-parser')
    , url = require('url');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.set('passport', require('./models/authentication.js').init(app));

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.redirect('login.html');
});

var sio = require('socket.io');
var io = sio(server);
require('./routes/routes.js').init(app, io);

server.listen(50000, function () {
    console.log('Listening on 50000');
});
