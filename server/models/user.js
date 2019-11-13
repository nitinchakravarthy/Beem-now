const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
  first_name : {type: String,
         required : true,
         trim: true
          },
  last_name : {type: String,
         required : true,
         trim: true
          },
  email: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
  password : {
    type: String,
    required: true,
    },
  verified: { type: Boolean, default: false },
  gender: {
    type: String,
    required: true,
    },
  batch : String,
  major : String,
  university : { type: String, default: 'Texas A&M university'},
  contactNumber : { type: String},
  avatar: String,
  createdAt : { type: Date, default: Date.now },
});

//hashing a password before saving it to the database
// supposed to be sending password hash from the front end itself
userSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash){
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
  }



// function to return a user of given uid

//functions to add, replace and remove user fields

//function to get all the rides posted

// function to get all the items posted

// function to check if the item is posted by the user:

// function to check if the ride is posted by the user

const User = mongoose.model('User', userSchema);

module.exports =  User;
