var mandrill = require('mandrill-api/mandrill');
var mandrillAPI = require('../config/mail');
var mailCreator = require('./mailCreator');
var User = require('../user/userModel');

var mandrill_client = new mandrill.Mandrill(mandrillAPI.APIKEY);
var mailController = {};

var accountsToVerify = {};
var forgottenAccounts = {};

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
    forgottenAccounts[rand] = email;
    var link="http://"+req.get('host')+"/recover?id="+rand;
    mandrill_client.messages.send({"message": mailCreator.createForgottenPasswordEmail(link), "async": false}, function(result) {
        console.log(result);
    }, function(e) {
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    });
    res.sendStatus(200);
}

function recoveredPassword(req, res, next) {
    if (forgottenAccounts[req.query.id]) {
        var forgottenUser = forgottenAccounts[req.query.id];
        User.findOne({email: forgottenAccounts[req.query.id]}, function(err, foundUser) {
            console.log('foundUser', foundUser);
            if (!err) {
                req.body = foundUser;
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
    var forgottenUser = forgottenAccounts[req.query.id];
    var newPassword = req.body.password;
    User.update({email: forgottenUser}, {password: newPassword}, function(err, updatedUser) {
        if (!err) {
            req.body.username = updatedUser.username;
            req.body.password = newPassword;
            next();
        }

    });

}

module.exports = mailController;




