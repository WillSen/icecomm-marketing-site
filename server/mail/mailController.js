var mandrill = require('mandrill-api/mandrill');
var mandrillAPI = require('../config/mail');
var mailCreator = require('./mailCreator');
var User = require('../user/userModel');
var tempUser = require('../tempUser/tempUserModel');


var mandrill_client = new mandrill.Mandrill(mandrillAPI.APIKEY);
var mailController = {};

// delete this
// var accountsToVerify = {};
var forgottenAccountEmail = {};

mailController.sendConfirmationEmail = sendConfirmationEmail;
mailController.verficationOfAccount = verficationOfAccount;
mailController.sendForgotPasswordEmail = sendForgotPasswordEmail;
mailController.verifyResetCode = verifyResetCode;
mailController.resetPassword = resetPassword;

function sendConfirmationEmail(req, res, next) {
    var tempAccount = req.body;
    var email = tempAccount.email;
    var rand = Math.floor((Math.random() * 1000000000000))
    host=req.get('host');
    console.log('tempAccount', tempAccount);
    tempAccount.rand = rand;
    // accountsToVerify[rand] = tempAccount;
    tempUser.create(tempAccount, function(err, createdAccount) {
        if (!err) {
            var link="http://"+req.get('host')+"/verify?id="+rand;
            mandrill_client.messages.send({"message": mailCreator.createVerificationEmail(email, link), "async": false}, function(result) {
                console.log(result);
            }, function(e) {
                console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
            });
            res.sendStatus(200);
        }
    });


};


function verficationOfAccount(req, res, next) {
    console.log("Domain is matched. Information is from Authentic email");

    tempUser.findOne({rand: req.query.id}, function(err, foundTemp) {
        if(!err) {
            console.log('verified');
            var verifiedAccount = {
                username: foundTemp.username,
                email: foundTemp.email,
                password: foundTemp.password
            };

            req.body = verifiedAccount;
            console.log(req.body);
            // accountsToVerify[req.query.id] = undefined;
            next();
        }
        else {
            console.log("email is not verified");
            res.redirect('/');
        }
    })
}

function sendForgotPasswordEmail(req, res, next) {
    var email = req.body.email;
    var rand = Math.floor((Math.random() * 1000000000000))
    host=req.get('host');
    forgottenAccountEmail[rand] = email;
    console.log('rand', rand);
    var link="http://"+req.get('host')+"/reset/" + rand;

    User.findOne({email: email}, function(err, foundUser) {
        var forgotEmailObj = {
            isValid: false
        };
        if (err || !foundUser) {
            res.send(forgotEmailObj);
        }
        if (foundUser) {
            var username = foundUser.username;
            mandrill_client.messages.send({"message": mailCreator.createForgottenPasswordEmail(email, username, link), "async": false}, function(result) {
                forgotEmailObj.isValid = true;
                res.send(forgotEmailObj);

            }, function(e) {
                console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
            });
        }
    });
}

function verifyResetCode(req, res, next) {
    var resetObj = {
        isValid: false
    };
    if (forgottenAccountEmail[req.body.resetId]) {
        resetObj.isValid = true;
    }
    res.send(resetObj);
}

function resetPassword(req, res, next) {
    console.log('reset password', req.body.resetId);
    var forgottenUserEmail = forgottenAccountEmail[req.body.resetId];
    var newPassword = req.body.password;
    console.log('email', forgottenUserEmail);
    User.findOne({email: forgottenUserEmail}, function(err, foundUser) {
        if (!err) {
            console.log('foundUser', foundUser);
            foundUser.password = newPassword;
            foundUser.save(function(err) {
                forgottenAccountEmail[req.body.resetId] = undefined;
                req.body.username = foundUser.username;
                req.body.password = newPassword;
                next();
            });
        }
        if (err) {
            console.log('error resetting password');
        }

    });

}

module.exports = mailController;




