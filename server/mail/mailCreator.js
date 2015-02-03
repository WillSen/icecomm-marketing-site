var messageContent = {
  to:       'icecomm.io@gmail.com',
  from:     'icecomm.io@gmail.com',
  subject:  'Hello World',
  text:     'My first email through SendGrid.'
};

var mailCreator = {};
mailCreator.createVerificationEmail = createVerificationEmail;
mailCreator.createForgottenPasswordEmail = createForgottenPasswordEmail;

function createVerificationEmail(email, link) {
    var text = "Please click the following link to validate your email and sign in:\n\n" + link + "\n";
    var subject = "IceComm Verification Email";
    messageContent.text = text;
    messageContent.subject = subject;
    messageContent.to = email;

    return messageContent;
}

function createForgottenPasswordEmail(email, username, link) {
    var text = "Please visit the following link to reset your password:\n\n" + link + "\n";
    var subject = "IceComm Forgotten Password Email";
    messageContent.text = text;
    messageContent.subject = subject;
    messageContent.to = email;
    return messageContent;
}

module.exports = mailCreator;