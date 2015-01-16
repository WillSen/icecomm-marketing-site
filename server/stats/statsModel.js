var mongoose = require('mongoose');

var statsSchema = mongoose.Schema({
  date: { type: String, required: true},
  apiKey: {type: String},
  room: {type: String}
});

module.exports = mongoose.model('Stats', statsSchema);
