var express = require('express');
var bodyParser = require('body-parser');
var axios = require('axios');
const path = require('path');
const Ride = require('../models/ride');
const {check, validationResult} = require('express-validator');

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
  geocode();
  function geocode() {
    var location = req.body.initialAddress;
    axios.get('http://www.datasciencetoolkit.org/maps/api/geocode/json',
    {
      params: {
        address : location
      }
    })
    .then(function(res){
      console.log(res);
      var formattedAddress = res.data.results[0].formatted_Address;
      console.log(formattedAddress); // pretty display
      var lat = parseFloat(res.data.results[0].geometry.location.lat);
      var lng = parseFloat(res.data.results[0].geometry.location.lng);
      var initialCoords = ([lng, lat]);
    });
    location = req.body.finalAddress;
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

  ride = new Ride({
    roundTrip : req.body.roundTrip, departDate : req.body.departDate,
    returnDate : req.body.returnDate, maxCapacity : req.body.maxCapacity,
    pricePerSeat : req.body.pricePerSeat, originCity : req.body.originCity,
    destinationCity : req.body.destinationCity, initialAddress : req.body.initialAddress,
    occupiedCapacity : req.body.occupiedCapacity,
     // initialCoords.coordinates : initialCoords,
    // finalCoords.coordinates : finalCoords
    // initialCoords and finalCoords are .coordinates within geoschema
  }); // new Ride ()

  ride.save(function(err) {
    if (err) { return res.status(500).send({ msg: err.message }); }
    console.log("Ride Saved");
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

    const ride = ride.toJSON();
    res.send({ ride: ride });
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

    const ride = ride.toJSON();
    res.send({ ride : ride });
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

    const ride = ride.toJSON();
    res.send({ ride : ride });
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

    const ride = ride.toJSON();
    res.send({ ride : ride });
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

    const ride = ride.toJSON();
    res.send({ ride : ride });
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

    const ride = ride.toJSON();
    res.send({ ride : ride });
  });
};

exports.joinRide = function(req, res, next) {
  // Check for validation error
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) return res.status(422).jsonp(errors.array());

  console.log(req.body);
  Ride.find({ _id : req.body.rid }, function(err, ride) {
    if (err) return res.status(500).send({ msg: err.message });
    if (!ride) return res.status(400).send({ msg: 'We were unable to find this ride information' });

    if (ride){
      if (ride.occupiedCapacity < ride.maxCapacity) {
        ride.occupiedCapacity += 1;
        ride.riders.push(req.body.rid);
      } else {
        return res.status(400).send({ msg: 'Unable to join ride. Maximum capacity has been reached.' });
      }
      ride.save(function(err) {
        if (err) { return res.status(500).send({ msg: err.message }); }
        console.log("Ride joined sucessfully");
        });
    };
    const ride = ride.toJSON();
    res.send({ ride : ride });
  });
};