var mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const itemSchema = new mongoose.Schema({
  createdAt : { type: Date,default: Date.now, required:true },
  poster : { type: mongoose.Schema.Types.ObjectId,required: true, ref: 'User' },
  name : {type : String, required: true, trim: true},
  description : {type : String, trim: true},
  size : { type : String, required : true },
  image : { type : String, required : true },
  pickedupBy : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  matchedRide : { type: mongoose.Schema.Types.ObjectId, ref: 'Ride' },
  price : { type : Number, required : true },
  origin: {type: [Number], required : true},
  dest : {type: [Number], required : true},
  paymentStatus : {type : String, required: true},
  deliveryStatus : Boolean,
  deliveredAt : { type: Date }
});

// Get itemSchema
itemSchema.statics.getItems = function(callback, limit){
  Items.find(callback).limit(limit);
}

// Get Items by ID
itemSchema.statics.getItemsById = function(id, callback){
  Items.findById(id, callback);
}

// Get Items by user posted (for user history & tracking)
itemSchema.statics.getUserItems = function(pr, callback){
  var search_key = {poster : pr};
  Items.find(search_key, callback);
}

// Get Items by driver picked up (for driver history & tracking)
itemSchema.statics.getDriverItems = function(pr, callback){
  var search_key = {pickedupBy : pr};
  Items.find(search_key, callback);
}

// Get Items by size (for driver sorting to fit in car)
itemSchema.statics.getItemsBySize = function(sz, callback){
  var search_key = {size : sz};
  Items.find(search_key, callback);
}

// Add Items
itemSchema.statics.addItem = function(item, callback){
  Items.create(item, callback);
}

itemSchema.statics.deleteItem = function(id, callback){
  Items.deleteOne(id, callback);
}

// Update Item properties from user
itemSchema.statics.updateItem = function(id, item, options, callback){
  var query = {_id: id};
  var update = {
    //You don't want to update item_id, createdAt, poster_uid, user.
    //Main updates will consist of deliveryStatus, pickedupBy, deliveredAt
    description : item.description,
    size : item.size,
    imageURI : item.imageURI,
    price : item.price,
    origin : item.origin,
    dest : item.dest,
    deliveryStatus : item.deliveryStatus,
    deliveredAt : item.deliveredAt
  }
  Items.findOneAndUpdate(query, update, options, callback);
}

// Update pickedUpBy
itemSchema.statics.updateItemPickup = function(id, item, options, callback){
  var query = {_id: id};
  var update = {
    pickedupBy : item.pickedUpBy,
    matchedRide : item.matchedRide
    //Don't know what matchedRide does so I am putting it here just incase!
  }
  Items.findOneAndUpdate(query, update, options, callback);
}

// Update Status of Item
itemSchema.statics.updateItemStatus = function(id, item, options, callback){
  var query = {_id: id};
  var update = {
    deliveryStatus : item.deliveryStatus
  }
  Items.findOneAndUpdate(query, update, options, callback);
}

// Update Item delivery
itemSchema.statics.updateItemDelivery = function(id, item, options, callback){
  var query = {_id: id};
  var update = {
    deliveryStatus : item.deliveryStatus,
    deliveredAt : item.deliveredAt
  }
  Items.findOneAndUpdate(query, update, options, callback);
}

var Items = mongoose.model('Items', itemSchema);

module.exports =  Items;
