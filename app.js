var express = require("express");
var app = express();
const fs = require('fs');

var user = require('./routes/user');
var auth = require('./routes/auth');

var path = require('path');
app.use(express.static('public'));
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.disable('etag');

app.set('views', path.join(__dirname, 'public/views/users'));
app.set('view engine', 'ejs');

app.use('/auth', auth);
app.use('/user', user);

var server = app.listen(8081, function () {
    var host = server.address().address === "::" ? "localhost" :
        server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});

module.exports = app;

