var express = require("express");
var app = express();
const fs = require('fs');
var firebase = require('firebase');

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCh4FmRUWQV4SVjfVIVCZOm8RXu0jKGJr8",
    authDomain: "gp-project-e7762.firebaseapp.com",
    databaseURL: "https://gp-project-e7762.firebaseio.com",
    projectId: "gp-project-e7762",
    storageBucket: "gp-project-e7762.appspot.com",
    messagingSenderId: "914400490940"
};

firebase.initializeApp(config);
const auth = firebase.auth();
var database = firebase.database();

app.use(express.static('public'));
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.set('view engine', 'ejs');




app.post("/api/user/register", function (req, res) {

    name = req.body.name;
    email = req.body.email;
    bornDate = req.body.bornDate;
    address = req.body.address;
    phoneNumber = req.body.phoneNumber;
    password = req.body.password;

    const promise = auth.createUserWithEmailAndPassword(email, password).then(function () {
        var user = firebase.auth().currentUser;
        user.updateProfile({
            displayName: name,
            email: email,
            phoneNumber: phoneNumber
        }).then(function () {
            console.log("afinal deu");
        }, function (error) {
            console.log("naoooo");
        });
        writeUserData(user.uid, name, email, bornDate, address, phoneNumber);
    });

    res.render(__dirname + "/" + "/public/views/homepage.ejs");
});

app.post("/api/user/login", function (req, res) {

    email = req.body.email;
    password = req.body.password;

    const promise = auth.signInWithEmailAndPassword(email, password);
    promise.catch(e => console.log(e.message));

    var user = firebase.auth().currentUser;

    res.render(__dirname + "/" + "/public/views/authenticatedHomepage.ejs");
});


app.get("/api/user/logout", function (req, res) {
    firebase.auth().signOut().then(function () {
        res.render(__dirname + "/" + "/public/views/homepage.ejs");
    }).catch(function (error) {
        console.log("algo errado não deu certo");
    })
});

app.get("/homepage", function (req, res) {
    res.render(__dirname + "/" + "/public/views/homepage.ejs");
});

app.get("/homepageAuth", function (req, res) {
    var user = firebase.auth().currentUser;
    var userName = user ? user.displayName : "Utilizador";
    res.render(__dirname + "/" + "/public/views/authenticatedHomepage.ejs", {
        name: userName
    });
});

app.get("/api/user/register", function (req, res) {
    res.render(__dirname + "/" + "/public/views/register.ejs");
});

app.get("/api/user/login", function (req, res) {
    res.render(__dirname + "/" + "/public/views/login.ejs");
});

app.get("/api/user/recoverPassword", function (req, res) {
    res.render(__dirname + "/" + "/public/views/recoverPassword.ejs");
});

app.get("/api/user/recoverPasswordSuccess", function (req, res) {
    res.render(__dirname + "/" + "/public/views/recoverPasswordSuccess.ejs");
});

app.get("/api/user/editPassword", function (req, res) {
    res.render(__dirname + "/" + "/public/views/editPassword.ejs");
});

app.get("/api/user/profile", function (req, res) {
    res.render(__dirname + "/" + "/public/views/profile.ejs");
});

app.get("/api/user/editProfile", function (req, res) {
    res.render(__dirname + "/" + "/public/views/editProfile.ejs");
});

app.post("/api/user/editProfile", function (req, res) {
    var user = firebase.auth().currentUser;

    username = req.body.name;
    email = req.body.email;
    bornDate = req.body.bornDate;
    address = req.body.address;
    phoneNumber = req.body.phoneNumber;
    newPassword = req.body.password;

    user.updateProfile({
        displayName: username,
        email: email
    }).then(function () {
    }).catch(function (error) {
    });

    user.updateEmail(email).then(() => {
    }, (error) => {
    });

    updateUserData(user.uid, username, email, bornDate, address, phoneNumber);
    res.render(__dirname + "/" + "/public/views/homepage.ejs");
});

app.get("/api/user/changePassword", function (req, res) {
    res.render(__dirname + "/" + "/public/views/changePassword.ejs");
});

app.post("/api/user/changePassword", function (req, res) {
    var user = firebase.auth().currentUser;

    newPassword = req.body.password;
    oldPassword = req.body.oldPassword;

    var credential = firebase.auth.EmailAuthProvider.credential(user.email, oldPassword);

    user.reauthenticateAndRetrieveDataWithCredential(credential).then(function () {
        user.updatePassword(newPassword).then(() => {
        }, (error) => {
        });
        res.render(__dirname + "/" + "/public/views/homepageAuth.ejs");
    }).catch(function (error) {
        console.log("erro: pass nao corresponde");
    });




});

var server = app.listen(8081, function () {
    var host = server.address().address === "::" ? "localhost" :
        server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});


firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        console.log(firebaseUser.displayName);
        //document.getElementById("userNameHeader").textContent = user.email;
    } else {
        console.log('não efetuou login');
    }
});

function writeUserData(userId, name, email, bornDate, address, phoneNumber) {
    firebase.database().ref('users/' + userId).set({
        username: name,
        email: email,
        bornDate: bornDate,
        address: address,
        phoneNumber: phoneNumber
    });
}

function updateUserData(userId, name, email, bornDate, address, phoneNumber) {
    firebase.database().ref('users/' + userId).update({
        username: name,
        email: email,
        bornDate: bornDate,
        address: address,
        phoneNumber: phoneNumber
    });
}
