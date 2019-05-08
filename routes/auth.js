var express = require("express");
var router = express.Router();
var firebase = require('firebase');
const config = require("./config.json");

firebase.initializeApp(config);
const auth = firebase.auth();

router.get("/homepage", function (req, res) {
    res.render('homepage.ejs');
});

router.get("/homepageAuth", function (req, res) {
    var user = firebase.auth().currentUser;
    var userName = user ? user.displayName : "Utilizador";
    res.render('authenticatedHomepage.ejs', {
        name: userName
    });
});

router.get("/register", function (req, res) {
    res.render('register.ejs');
});

router.get("/login", function (req, res) {
    var erro = "";
    res.render('login.ejs', {
        erro: erro
    });
});

router.get("/logout", function (req, res) {
    firebase.auth().signOut().then(function () {
        res.render('homepage.ejs');
    }).catch(function (error) {
        console.log("algo errado não deu certo");
    })
});

router.post('/register', function (req, res) {
    name = req.body.name;
    email = req.body.email;
    bornDate = req.body.bornDate;
    address = req.body.address;
    phoneNumber = req.body.phoneNumber;
    password = req.body.password;
    confpassword = req.body.confpassword;

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

    res.render('authenticatedHomepage.ejs');
});

router.post('/login', function (req, res) {
    email = req.body.email;
    password = req.body.password;

    const promise = auth.signInWithEmailAndPassword(email, password).then(function () {
        var user = firebase.auth().currentUser;
        res.render('authenticatedHomepage.ejs', {
            name: user.displayName
        });
    }).catch(function (error) {
        res.render('login.ejs');
    });
    promise.catch(e => console.log(e.message));
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

module.exports = router;