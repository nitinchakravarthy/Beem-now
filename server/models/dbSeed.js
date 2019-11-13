var mongoose = require('mongoose');

var User = require('./user');
var Ride = require('./ride');
var Item = require('./item');

const createSeed = async ()  => {

  const user1 = new User({
    username: 'beem',
  })

  const ride1 = new Ride({
    roundTrip : true,
    user: user1.id,
  });

  const item1 = new Item({
    name : 'Mac',
    user: user1.id,
  });

   await item1.save();
   await message1.save();
   await user1.save();
};

module.exports = createSeed;
