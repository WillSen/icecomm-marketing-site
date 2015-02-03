var mailCreator = require('./mailCreator');
var User = require('../user/userModel');
var tempUser = require('../tempUser/tempUserModel');
var sendGridInfo = require('../config/mail');
var sendgrid  = require('sendgrid')(sendGridInfo.api_user, sendGridInfo.api_key);

var mailController = {};

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
    tempAccount.rand = rand;
    tempUser.create(tempAccount, function(err, createdAccount) {
        if (!err) {
            var link="http://"+req.get('host')+"/verify?id="+rand;
            sendgrid.send(mailCreator.createVerificationEmail(email, link), function(err, json) {
                if (err) {
                    return console.error(err);
                } else {
                    res.sendStatus(200);
                }

            });


        }
    });


};


function verficationOfAccount(req, res, next) {
    tempUser.findOne({rand: req.query.id}, function(err, foundTemp) {
        if(!err) {
            console.log('verified');
            var verifiedAccount = {
                username: foundTemp.username,
                email: foundTemp.email,
                password: foundTemp.password
            };

            req.body = verifiedAccount;
            foundTemp.remove();
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

    var link="http://"+req.get('host')+"/reset/" + rand;
    User.findOne({email: email}, function(err, foundUser) {
        var forgotEmailObj = {
            isValid: false
        };
        if (err || !foundUser) {
            res.send(forgotEmailObj);
        }
        if (foundUser) {

            var forgotAccount = {
                rand: rand,
                email: email
            };
            tempUser.create(forgotAccount, function(err, createdTempAccount) {
                var username = foundUser.username;

                sendgrid.send(mailCreator.createForgottenPasswordEmail(email, username, link), function(err, json) {
                    if (err) {
                        return console.error(err);
                    } else {
                        forgotEmailObj.isValid = true;
                        res.send(forgotEmailObj);
                    }
                });
            });


        }
    });
}

function verifyResetCode(req, res, next) {
    var resetObj = {
        isValid: false
    };

    tempUser.findOne({rand: req.body.resetId}, function(err, foundTempUser) {
        if (err) {

        }
        if (foundTempUser) {
           resetObj.isValid = true;
        }
        res.send(resetObj);
    });

}

function resetPassword(req, res, next) {
    var newPassword = req.body.password;

    tempUser.findOne({rand: req.body.resetId}, function(err, foundTempUser) {
        if (!err) {
            User.findOne({email: foundTempUser.email}, function(err, foundUser) {
                if (!err) {
                    console.log('foundUser', foundUser);
                    foundUser.password = newPassword;
                    foundUser.save(function(err) {
                        req.body.username = foundUser.username;
                        req.body.password = newPassword;
                        foundTempUser.remove();
                        next();
                    });
                }
                if (err) {
                    console.log('error resetting password');
                }

            });
        }
    });
}

module.exports = mailController;




