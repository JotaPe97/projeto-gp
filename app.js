var express = require("express");
var app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
var path = require('path');
var user = require('./routes/user');
var auth = require('./routes/auth');

app.use(express.static('public'));
app.use(bodyParser.json());
//app.use('/auth', auth);
//app.use('/user', user);
app.use('/', auth);
app.disable('etag');

app.set('views', path.join(__dirname, 'public/views/User'));
app.set('view engine', 'ejs');


var server = app.listen(8081, function () {
    var host = server.address().address === "::" ? "localhost" :
        server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});

module.exports = app;


