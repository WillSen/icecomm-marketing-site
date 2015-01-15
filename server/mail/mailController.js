var mandrill = require('mandrill-api/mandrill');
var mandrillAPI = require('../config/mail');
var mailCreator = require('./mailCreator');

var mandrill_client = new mandrill.Mandrill(mandrillAPI.APIKEY);
var mailController = {};

var accountsOnHold = {};

mailController.sendConfirmationEmail = sendConfirmationEmail;
mailController.verficationOfAccount = verficationOfAccount;

function sendConfirmationEmail(req, res, next) {

    var tempAccount = req.body;
    var rand=Math.floor((Math.random() * 1000) + 54);
    host=req.get('host');
    console.log('host', host);

    accountsOnHold[rand] = tempAccount;

    link="http://"+req.get('host')+"/verify?id="+rand;
    mandrill_client.messages.send({"message": mailCreator(link), "async": false}, function(result) {
        console.log(result);
    }, function(e) {
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    });
    res.sendStatus(200);
};


function verficationOfAccount(req, res, next) {
    console.log("Domain is matched. Information is from Authentic email");
    console.log(req.query.id);
    if(accountsOnHold[req.query.id]) {
        console.log(accountsOnHold[req.query.id]);
        req.body = accountsOnHold[req.query.id];
        accountsOnHold[req.query.id] = undefined;
        next();
    }
    else {
        console.log("email is not verified");
        res.redirect('/');
    }
}

module.exports = mailController;




