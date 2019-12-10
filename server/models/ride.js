var mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const User = require('./user');

const GeoSchema = new mongoose.Schema({
  type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: "Point"
  },
  coordinates: {
    type: [Number],
    required: true
  },
});


const rideSchema = new mongoose.Schema({
  host: { type: mongoose.Schema.Types.ObjectId,
    ref: 'User' },
  //host : { type : String,
    //      required : true },
  createdAt : { type : Date,
            default : Date.now },
  roundTrip : { type : Boolean,
              required : true },
  departDate : { type : Date,
                required : true },
  maxCapacity : { type : Number,
                required : true},
  capacityLeft : { type : Number},
  pricePerSeat : { type : Number,
                required : true },
  riders : [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // string array of rider UIDs
  originCity: { type : String,
              required : true },
  destinationCity : { type : String,
              required : true },
  initialAddress : { type : String,
              required : false },
  finalAddress : { type : String,
              required : false },
  initialCoords : { type:  GeoSchema,
              required : false}, //change to GeoSchema
  finalCoords : { type : GeoSchema,
              required : false }
});
rideSchema.index({initialCoords: "2dsphere"});
rideSchema.index({finalCoords: "2dsphere"});
const Ride = mongoose.model('Ride', rideSchema);

module.exports = Ride;
