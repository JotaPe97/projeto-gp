var express = require("express");
var router = express.Router();
var firebase = require('firebase');


router.post('/editProfile', function (req, res) {
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
    res.render('homepage.ejs');
});

router.get("/editProfile", function (req, res) {
    var userId = firebase.auth().currentUser.uid;
    firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
        var address = (snapshot.val() && snapshot.val().address) || 'cidade anónima';
        var bornDate = (snapshot.val() && snapshot.val().username) || 'Anonymous';
        var email = (snapshot.val() && snapshot.val().email) || 'xpto@hotmail.com';
        var phoneNumber = (snapshot.val() && snapshot.val().phoneNumber) || '999999999';
        var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';

        res.render('editProfile.ejs', {
            address: address,
            bornDate: bornDate,
            email: email,
            phoneNumber: phoneNumber,
            name: username
        });
    });
});

router.get("/profile", function (req, res) {
    var userId = firebase.auth().currentUser.uid;
    firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
        var address = (snapshot.val() && snapshot.val().address) || 'cidade anónima';
        var bornDate = (snapshot.val() && snapshot.val().bornDate) || 'Anonymous';
        var email = (snapshot.val() && snapshot.val().email) || 'xpto@hotmail.com';
        var phoneNumber = (snapshot.val() && snapshot.val().phoneNumber) || '999999999';
        var name = (snapshot.val() && snapshot.val().username) || 'Anonymous';

        var age = calcAge(bornDate);

        res.render('profile.ejs', {
            address: address,
            bornDate: bornDate,
            email: email,
            phoneNumber: phoneNumber,
            name: name,
            age: age
        });
    });
});

router.post('/changePassword', function (req, res) {
    var user = firebase.auth().currentUser;

    newPassword = req.body.password;
    oldPassword = req.body.oldPassword;

    var credential = firebase.auth.EmailAuthProvider.credential(user.email, oldPassword);

    user.reauthenticateAndRetrieveDataWithCredential(credential).then(function () {
        user.updatePassword(newPassword).then(() => {
        }, (error) => {
        });
        res.render('authenticatedHomepage.ejs');
    }).catch(function (error) {
        console.log("erro: pass nao corresponde");
    });

});


router.get("/recoverPassword", function (req, res) {
    res.render('recoverPassword.ejs');
});

router.get("/recoverPasswordSuccess", function (req, res) {
    res.render('recoverPasswordSuccess.ejs');
});

router.get("/editPassword", function (req, res) {
    var user = firebase.auth().currentUser;
    res.render('editPassword.ejs', {
        name: user.displayName
    });
});

router.get("/changePassword", function (req, res) {
    var user = firebase.auth().currentUser;
    var oldPass = "oioio";
    res.render('changePassword.ejs', {name: user.displayName, oldPass: oldPass});
});


function updateUserData(Id, name, email, bornDate, address, phoneNumber) {
    firebase.database().ref('users/' + userId).update({
        username: name,
        email: email,
        bornDate: bornDate,
        address: address,
        phoneNumber: phoneNumber
    });
}

function calcAge(dateString) {
    var birthdate = new Date(dateString);
    var cur = new Date();
    var diff = cur - birthdate;
    var age = Math.floor(diff / 31557600000);
    return age;
}

module.exports = router;