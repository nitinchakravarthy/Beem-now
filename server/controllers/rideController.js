var express = require('express');
var bodyParser = require('body-parser');
var axios = require('axios');
const path = require('path');
const User = require('../models/user');
const Ride = require('../models/ride');
const {check, validationResult} = require('express-validator');
const nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({ service: 'Sendgrid',
                                              auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });


// Create a ride with required values
exports.createRide = function(req, res, next) {
  // Check for validation error
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) return res.status(422).jsonp(errors.array());

  console.log(req.body);
  // ** TODO
  // check for if user has created ride in same dates...

  // Geocode address into coordinates
  //geocode();
  function geocode() {
    var location = req.body.originCity;
    console.log(location);
    axios.get('http://www.datasciencetoolkit.org/maps/api/geocode/json',
    {
      params: {
        address : location
      }
    })
    .then(function(res){
      //console.log(res);
      //var formattedAddress = res.data.results[0].formatted_Address;
      //console.log(formattedAddress); // pretty display
      var lat = parseFloat(res.data.results[0].geometry.location.lat);
      var lng = parseFloat(res.data.results[0].geometry.location.lng);
      var initialCoords = ([lng, lat]);
    });
    location = req.body.destinationCity;
    axios.get('http://www.datasciencetoolkit.org/maps/api/geocode/json',
    {
      params: {
        address : location
      }
    })
    .then(function(res){
      console.log(res);
      formattedAddress = res.data.results[0].formatted_Address;
      console.log(formattedAddress); // pretty display
      var lat = parseFloat(res.data.results[0].geometry.location.lat);
      var lng = parseFloat(res.data.results[0].geometry.location.lng);
      var finalCoords = ([lng, lat]);
    });
  } // function geocode()
  console.log("Coordinates:------------");
  //console.log(initialCoords);
  //console.log(finalCoords);
  //const initialPoint = { type: 'Point', coordinates: initialCoords };
  //const finalPoint = { type: 'Point', coordinates: finalCoords };
  ride = new Ride({
    roundTrip : req.body.roundTrip,
    departDate : req.body.departDate,
    returnDate : req.body.returnDate,
    maxCapacity : req.body.maxCapacity,
    pricePerSeat : req.body.pricePerSeat,
    originCity : req.body.originCity,
    destinationCity : req.body.destinationCity,
    host: '5de1aaaad055f316f87c57ef'
    // initialAddress : req.body.initialAddress,
    // occupiedCapacity : req.body.occupiedCapacity,
    // initialCoords : initialPoint,
    // finalCoords : finalPoint
    // initialCoords and finalCoords are .coordinates within geoschema
  }); // new Ride ()

  ride.save(function(err) {
    if (err) { return res.status(500).send({ msg: err.message }); }
    console.log("Ride Saved");
    res.send({'rideStatus' : true})
  });
  console.log(ride);
};




// Return "all" ride specific info to driver
exports.getDriverRideInfo = function(req, res, next) {
  // Check for validation error
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) return res.status(422).jsonp(errors.array());

  console.log(req.body);

  Ride.find({ _id : req.body.rid, uid : req.body.uid }, function(err, ride){
    if (err) return res.status(500).send({ msg: err.message });
    if (!ride) return res.status(400).send({ msg: 'We were unable to find your ride information' });

    const result = ride.toJSON();
    res.send({ ride: result });
  }); // Ride.find()
};


// Return necessary ride info to rider
// This function differs from driver ride info as it does not return the rider ids for passengers
// Driver should need that info
exports.getUserRideInfo = function(req, res, next) {
  // Check for validation error
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) return res.status(422).jsonp(errors.array());

  console.log(req.body);
  Ride.find({ _id : req.body.rid, riders : req.body.uid }, {'riders' : 0}, function(err, ride){
    if (err) return res.status(500).send({ msg: err.message });
    if (!ride) return res.status(400).send({ msg: 'We were unable to find your ride information' });

    const result = ride.toJSON();
    res.send({ ride : result });
  });
};


// return initial coordinates
exports.getInitialCoords = function(req, res, next) {
  // Check for validation error
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) return res.status(422).jsonp(errors.array());

  console.log(req.body);

  Ride.find({ _id : req.body.rid, uid : req.body.uid }, {'initialCoords': 1, '_id': 0}, function(err, ride){
    if (err) return res.status(500).send({ msg: err.message });
    if (!ride) return res.status(400).send({ msg: 'We were unable to find your ride information' });

    const result = ride.toJSON();
    res.send({ ride : result });
  }); // Ride.find()
};

// return final coordinates
exports.getFinalCoords = function(req, res, next) {
  // Check for validation error
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) return res.status(422).jsonp(errors.array());

  console.log(req.body);

  Ride.find({ _id : req.body.rid, uid : req.body.uid }, {'finalCoords': 1, '_id': 0}, function(err, ride){
    if (err) return res.status(500).send({ msg: err.message });
    if (!ride) return res.status(400).send({ msg: 'We were unable to find your ride information' });

    const result = ride.toJSON();
    res.send({ ride : result });
  }); // Ride.findOne()
};


// Get all of the rides created by a driver
exports.getDriverRides = function(req, res, next) {
  // Check for validation error
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) return res.status(422).jsonp(errors.array());

  console.log(req.body);
  Ride.find({ host : req.body.uid }, function(err, ride) {
    if (err) return res.status(500).send({ msg: err.message });
    if (!ride) return res.status(400).send({ msg: 'We were unable to find your ride information' });

    const result = ride.toJSON();
    res.send({ ride : result });
  });
};


// get all of the rides assigned to the RID of the passenger
// returns all but the rider IDs of other ride passengers
exports.getRiderRides = function(req, res, next) {
  // Check for validation error
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) return res.status(422).jsonp(errors.array());

  console.log(req.body);
  Ride.find({ riders : req.body.uid }, {'riders' : 0}, function(err, ride) {
    if (err) return res.status(500).send({ msg: err.message });
    if (!ride) return res.status(400).send({ msg: 'We were unable to find your ride information' });

    const result = ride.toJSON();
    res.send({ ride : result });
  });
};

//Search Rides by origin, destination, departure date and return date
//if returnDate is null, returnRides are returned as null.
//if no search results exists empty array is returned.
exports.searchRide = function(req, res, next) {
  // Check for validation error
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) return res.status(422).jsonp(errors.array());
  console.log('Input:', req.body);
  //dates for query
  var departDate_start = new Date(req.body.departDate)
  var departDate_end = new Date(departDate_start.getTime()+(1*24*60*60*1000))
  Ride.find(
      { departDate:{"$gte": departDate_start,
                    "$lt": departDate_end
                  },
        originCity:req.body.originCity,
        destinationCity:req.body.destinationCity
      }, 'host departDate originCity destinationCity maxCapacity occupiedCapacity pricePerSeat'
      ).populate('host').exec(function(err, departure_rides){
      if (err) return res.status(500).send({ msg: err.message });
      const result_d = JSON.stringify(departure_rides);

      if (req.body.returnDate){
        //dates for query
        returnDate_start = new Date(req.body.returnDate)
        returnDate_end = new Date(returnDate_start.getTime() + (1*24*60*60*1000))
        Ride.find(
          { departDate:{"$gte": returnDate_start,
                        "$lt": returnDate_end
                        },
            originCity:req.body.destinationCity ,
            destinationCity:req.body.originCity
          }, 'host departDate originCity destinationCity maxCapacity occupiedCapacity pricePerSeat'
          ).populate('host').exec(function(err, return_rides){
          if (err) return res.status(500).send({ msg: err.message });
          const result_r = JSON.stringify(return_rides);
          console.log(result_d, result_r)
          res.send({ error_code: 0, departure_rides: result_d,
                 return_rides: result_r });
          });
      }
      else{
        res.send({ error_code: 0, departure_rides: result_d,
                 return_rides: null });
      }
    });
};

//Search Rides by userID (both passenger and driver)
//if no rides, empty array are returned
exports.rideHistory = function(req, res, next) {
  // Check for validation error
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) return res.status(422).jsonp(errors.array());
  console.log('UserID', req.body.user_id);
  var ObjectId = require('mongoose').Types.ObjectId;
  Ride.find({
        //match the object id of host
        host: new ObjectId(req.body.user_id)
      }).exec(function(err, driver_rides){
      if (err) return res.status(500).send({ msg: err.message });
      const driver_rides_result = JSON.stringify(driver_rides);
      Ride.find({
          //search in riders array for user_id
          riders : req.body.user_id
        }).exec(function(err, passenger_rides){
        if (err) return res.status(500).send({ msg: err.message });
        const passenger_rides_result = JSON.stringify(passenger_rides);
        console.log(driver_rides, passenger_rides)
        res.send({ error_code: 0, passenger_rides: driver_rides_result,
               driver_rides: passenger_rides_result });
        });
    });
};

exports.chooseride = function(req,res,next){
      const errors = validationResult(req);
      console.log(errors);
      if (!errors.isEmpty()) return res.status(422).jsonp(errors.array());
      console.log(req.body.uid);
      console.log(req.body.depart_rid);
      console.log(req.body.user);
      Ride.find({_id : req.body.rid}).exec(function(err,ride){
          if (err) return res.status(500).send({ msg: err.message });
          const host = ride.host;
          console.log(host);
          console.log(host._id);

          const mailOptions = { from: process.env.SENDGRID_EMAIL, to: host.email, subject: 'Someone wants to pick your ride',
                            text: "Hi, " + req.body.user.name + " wants to choose your ride from " + ride.originCity + " to " + ride.destinationCity };
          console.log(mailOptions);
          // notify the host that a person wants to ride with them.
          transporter.sendMail(mailOptions, function (err) {
                  if (err) { console.log(err);return res.status(500).send({ msg: err.message }); }
                  console.log("Mail sent");
                  const resp = {'mailSent': true, 'email': user.email};
                  res.status(200).send(resp);
          });
      })
  }
