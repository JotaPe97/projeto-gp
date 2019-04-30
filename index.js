var express = require("express");
var app = express();
const fs = require('fs');


app.use(express.static('public'));
app
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.set('view engine', 'ejs');


app.get("/homepage", function (req, res) {
    res.render(__dirname + "/" + "/public/views/homepage.ejs");
});

app.get("/homepageAuth", function (req, res) {
    res.render(__dirname + "/" + "/public/views/authenticatedHomepage.ejs");
});


app.get("/api/user/register", function(req, res){
    res.render(__dirname + "/" + "/public/views/register.ejs");
});

app.get("/api/user/login", function(req, res){
    res.render(__dirname + "/" + "/public/views/login.ejs");
});

app.get("/api/user/recoverPassword", function(req, res){
    res.render(__dirname + "/" + "/public/views/recoverPassword.ejs");
});

app.get("/api/user/recoverPasswordSuccess", function(req, res){
    res.render(__dirname + "/" + "/public/views/recoverPasswordSuccess.ejs");
});

app.get("/api/user/profile", function(req, res){
    res.render(__dirname + "/" + "/public/views/profile.ejs");
});

var server = app.listen(8081, function () {
    var host = server.address().address === "::" ? "localhost" :
        server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});

