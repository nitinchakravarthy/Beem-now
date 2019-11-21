var mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

const User = require('./user');

const GeoSchema = new mongoose.Schema({
  type: {
      type: String,
      enum: ['Point'],
      required: true
  },
  coordinates: {
    type: [Number],
    index: "2dsphere",
    required: true
  }
});

const rideSchema = new mongoose.Schema({
  //host: { type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User' },
  host : { type : String,
          required : true },
  createdAt : { type : Date,
            default : Date.now },
  roundTrip : { type : Boolean,
              required : true },
  departDate : { type : Date,
                required : true },
  returnDate : { type : Date,
                required : true },
  maxCapacity : { type : Number,
                required : true},
  occupiedCapacity : { type : Number,
                returied : true },
  pricePerSeat : { type : Number,
                required : true },
  riders : [String], // string array of rider UIDs
  originCity: { type : String,
              required : true },
  destinationCity : { type : String,
              required : true },
  initialAddress : { type : String,
              required : true },
  finalAddress : { type : String,
              required : true },
  initialCoords : { type:  GeoSchema,
              required : true}, //change to GeoSchema
  finalCoords : { type : GeoSchema,
              required : true }
});

const Ride = mongoose.model('Ride', rideSchema);

module.exports = Ride;
