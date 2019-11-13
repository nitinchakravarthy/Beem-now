var mongoose = require('mongoose');

const nameSchema = new mongoose.Schema({
  first_name : String,
  last_name : String
});


var Name = mongoose.model('Name', nameSchema);


module.exports =  Name;
