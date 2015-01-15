var mandrill = require('mandrill-api/mandrill');
var mandrillAPI = require('../config/mail');
var mailCreator = require('./mailCreator');
var User = require('../user/userModel');

var mandrill_client = new mandrill.Mandrill(mandrillAPI.APIKEY);
var mailController = {};

var accountsToVerify = {};
var forgottenAccountEmail = {};

mailController.sendConfirmationEmail = sendConfirmationEmail;
mailController.verficationOfAccount = verficationOfAccount;
mailController.sendForgotPasswordEmail = sendForgotPasswordEmail;
mailController.recoveredPassword = recoveredPassword;
mailController.resetPassword = resetPassword;

function sendConfirmationEmail(req, res, next) {
    var tempAccount = req.body;
    var rand=Math.floor((Math.random() * 10000) + 54);
    host=req.get('host');
    accountsToVerify[rand] = tempAccount;
    var link="http://"+req.get('host')+"/verify?id="+rand;
    mandrill_client.messages.send({"message": mailCreator.createVerificationEmail(link), "async": false}, function(result) {
        console.log(result);
    }, function(e) {
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    });
    res.sendStatus(200);
};


function verficationOfAccount(req, res, next) {
    console.log("Domain is matched. Information is from Authentic email");
    if(accountsToVerify[req.query.id]) {
        req.body = accountsToVerify[req.query.id];
        accountsToVerify[req.query.id] = undefined;
        next();
    }
    else {
        console.log("email is not verified");
        res.redirect('/');
    }
}

function sendForgotPasswordEmail(req, res, next) {
    var email = req.body.email;
    var rand=Math.floor((Math.random() * 10000) + 54);
    host=req.get('host');
    forgottenAccountEmail[rand] = email;
    var link="http://"+req.get('host')+"/recover/" + rand;
    mandrill_client.messages.send({"message": mailCreator.createForgottenPasswordEmail(link), "async": false}, function(result) {
        console.log(result);
    }, function(e) {
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    });
    res.sendStatus(200);
}

function recoveredPassword(req, res, next) {
    console.log('recover should not be called');
    if (forgottenAccountEmail[req.body.resetId]) {
        var forgottenUser = forgottenAccountEmail[req.query.id];
        User.findOne({email: forgottenAccountEmail[req.query.id]}, function(err, foundUser) {
            console.log('foundUser', foundUser);
            if (!err) {
                req.body.username = foundUser.username;
                req.body.password =
                next();
            }
        });
    }
    else {
        console.log("recover password error");
        res.redirect('/');
    }
}

function resetPassword(req, res, next) {
    console.log('reset password');
    var forgottenUserEmail = forgottenAccountEmail[req.query.id];
    var newPassword = req.body.password;
    User.findOne({email: forgottenUserEmail}, function(err, foundUser) {
        if (!err) {
            foundUser.password = newPassword;
            foundUser.save();
            req.body.username = foundUser;
            req.body.password = newPassword;
            next();
        }
        if (err) {
            console.log('error resetting password');
        }

    });

}

module.exports = mailController;




