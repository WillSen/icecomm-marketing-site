var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

// define conversation schema
var tempUserSchema = new Schema({
  rand: {type: Number},
  username: {type: String},
  password: {type: String},
  email: {type: String}
});

// compile conversation schema into a conversation model
module.exports = mongoose.model('tempUser', tempUserSchema);