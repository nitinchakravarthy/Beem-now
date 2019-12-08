const mongoose = require('mongoose');

//TODO: Convert Strung to date in Date
const CarSchema = mongoose.Schema({
    name : String,
    friendId : String,
    msgs : [{from:String, message:String, time:String}],
    lastChatDate: String
});

module.exports = mongoose.model('Car', CarSchema);