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
var moment = require('moment-timezone');
//moment().format('L');
var MILES_TO_METRE = 1609.34;
var MAX_DISTANCE = 20 * MILES_TO_METRE;
// Create a ride with required values
exports.createRide = function(req, res, next) {
  // Check for validation error
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) return res.status(422).jsonp(errors.array());
  console.log(req.body);
  var departDate = moment(req.body.departDate + " " + req.body.departTime, 'MM-DD-YYYY hh:mm A').tz(req.body.timeZone);
  var utcDepartDate = new Date(departDate.format());
  console.log("Printing........");
  console.log(departDate.format());
  console.log(new Date(departDate.format()));
  console.log(departDate.utc().format());
  // check for if user has created ride in same dates...
  function geocode() {
    var originLocation = req.body.originCity;
    var destinationLocation = req.body.destinationCity;
    return axios.all([
      axios.get('https://nominatim.openstreetmap.org/search?format=json',
    {
      params: {
        q : originLocation
      }
    }),
     axios.get('https://nominatim.openstreetmap.org/search?format=json',
    {
      params: {
        q : destinationLocation
      }
    })
    ])
    .then((resArr)=> {
      var initialCoords = ([parseFloat(resArr[0].data[0].lon), parseFloat(resArr[0].data[0].lat)]);
      var finalCoords = ([parseFloat(resArr[1].data[0].lon), parseFloat(resArr[1].data[0].lat)]);
      //console.log("Inside");
      //console.log(initialCoords);
      //console.log(finalCoords);
      //return ([initialCoords, finalCoords]);
      const initialPoint = { type: 'Point', coordinates: initialCoords };
      const finalPoint = { type: 'Point', coordinates: finalCoords };
      ride = new Ride({
        roundTrip : req.body.roundTrip,
        departDate : utcDepartDate, //converts to UTC
        maxCapacity : req.body.maxCapacity,
        capacityLeft : req.body.maxCapacity,
        pricePerSeat : req.body.pricePerSeat,
        originCity : req.body.originCity,
        destinationCity : req.body.destinationCity,
        host:req.body.uid,
        initialCoords : initialPoint,
        finalCoords : finalPoint
        // initialCoords and finalCoords are .coordinates within geoschema
      }); // new Ride ()

      ride.save(function(err) {
        if (err) { console.log("Error inside rideController!!"); console.log(err.message);
          return res.status(500).send({ msg: err.message }); }
      });
      if (req.body.roundTrip) {
        console.log("RoundTrip is present!");
        var returnDate = moment(req.body.returnDate + " " + req.body.returnTime, 'MM-DD-YYYY hh:mm A').tz(req.body.timeZone);
        var utcReturnDate = new Date(returnDate.format());
        returnRide = new Ride({
        roundTrip : req.body.roundTrip,
        departDate : utcReturnDate,
        maxCapacity : req.body.maxCapacity,
        capacityLeft : req.body.maxCapacity,
        pricePerSeat : req.body.pricePerSeat,
        originCity : req.body.destinationCity,
        destinationCity : req.body.originCity,
        host: req.body.uid,
        initialCoords : finalPoint,
        finalCoords : initialPoint
        // initialCoords and finalCoords are .coordinates within geoschema
      }); // new Ride ()
      returnRide.save(function(err) {
        if (err) { console.log(err.message);
          return res.status(500).send({ msg: err.message }); }
        console.log("Ride Saved");
      });
      }
      //console.log("Transactions Done");
      res.send({'rideStatus' : true});

    })
    .catch((error) => {
      console.log("Error while fetching GeoSpatial Information!!")
      if (err) { console.log(err.message);
        return res.status(500).send({ msg: err.message }); }
    });
  } // function geocode()
    // Geocode address into coordinates
  geocode();
  //console.log("Done");
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
  var departDate_start = new Date(moment(req.body.departDate).format())
  var departDate_end = new Date(departDate_start.getTime()+(1*24*60*60*1000))
  console.log(departDate_start);
  console.log(departDate_end);
  //get co-ordniates
  Ride.find(
      { departDate:{"$gte": departDate_start,
                    "$lt": departDate_end
                },
        originCity:req.body.originCity, // second is a geospacial query
        destinationCity:req.body.destinationCity,
      }, 'host departDate originCity destinationCity maxCapacity occupiedCapacity pricePerSeat'
    ).populate('host', {}).exec(function(err, departure_rides){
      if (err) return res.status(500).send({ msg: err.message });
      const result_d = JSON.stringify(departure_rides);
      console.log("result_d");
      console.log(result_d);
      if (req.body.returnDate){
        //dates for query
        returnDate_start = new Date(req.body.returnDate)
        returnDate_end = new Date(returnDate_start.getTime() + (1*24*60*60*1000))
        Ride.find(
          { departDate:{"$gte": returnDate_start,
                        "$lt": returnDate_end
                        },
            originCity:req.body.destinationCity ,
            destinationCity:req.body.originCity,
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
      },'host departDate originCity destinationCity maxCapacity occupiedCapacity pricePerSeat'
      ).populate('host', { first_name: 1, avatar: 1}).sort('-departureDate').exec(function(err, driver_rides){
      if (err) return res.status(500).send({ msg: err.message });
      const driver_rides_result = JSON.stringify(driver_rides);
      Ride.find({
          //search in riders array for user_id
          riders : req.body.user_id
        },'host departDate originCity destinationCity maxCapacity occupiedCapacity pricePerSeat'
        ).populate('host', { first_name: 1, avatar: 1}).sort('-departureDate').exec(function(err, passenger_rides){
        if (err) return res.status(500).send({ msg: err.message });
        const passenger_rides_result = JSON.stringify(passenger_rides);
        console.log(driver_rides, passenger_rides)
        res.send({ error_code: 0, passenger_rides: passenger_rides_result,
               driver_rides: driver_rides_result });
        });
    });
};

exports.chooseride = function(req,res,next){
      const errors = validationResult(req);
      console.log(errors);
      if (!errors.isEmpty()) return res.status(422).jsonp(errors.array());
      console.log(req.body.uid);
      console.log(req.body.rid);
      Ride.findOne({_id : req.body.rid}).populate('host').populate('riders').exec(function(err,ride){
            if (err) return res.status(500).send({ msg: err.message });
            console.log("found ride");
            User.findOne({_id: req.body.uid},function(err,user){
                if (err) { return res.status(500).send({ msg: err.message }); }
                if (!user) return res.status(400).send({ msg: 'We were unable to find a user.' });
                if (!user.verified) return res.status(400).send({ type: 'Not-verified', msg: 'This user is not verified.' });
                var confirmLink = '\nhttp:\/\/' + req.headers.host + '\/rides\/updateRideConfirmed?uid=' + req.body.uid + "&rid=" + req.body.rid + "&seats=" + req.body.seats;
                var rejectLink = '\nhttp:\/\/' + req.headers.host + '\/rides\/updateRideRejected?uid=' + req.body.uid + "&rid=" + req.body.rid + "&seats=" + req.body.seats;
              const mailOptions_host = { from: process.env.SENDGRID_EMAIL, to: ride.host.email, subject: 'Someone wants to pick the ride you posted',
                                text: "Hi, \n\n" + user.first_name + " wants to ride with you from " + ride.originCity + " to " + ride.destinationCity + " on " + ride.departDate + " for "+ req.body.seats + "people.\n\n" +
                                "To confirm click on this link. \n\n" + confirmLink + "\n\n" + "To reject click on this link \n\n" + rejectLink + "\n\n" };
              console.log(mailOptions_host);
              // notify the host that a person wants to ride with them.
              transporter.sendMail(mailOptions_host, function (err) {
                      if (err) { console.log(err);return res.status(500).send({ msg: err.message }); }
                      console.log("Mail sent");
                      const resp = {'error_code':0, 'mailSent': true, 'email': ride.host.email, 'rideStatus':'REQUEST_SENT', 'msg':'Request has been sent to the ride host.'};
                      res.status(200).send(resp);
              });

            });
      });
}
exports.rideConfirmed = function(req,res,next){
    console.log(req.query.uid);
    console.log(req.query.rid);
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) return res.status(422).jsonp(errors.array());

    Ride.findOne({_id : req.query.rid}).populate('host').populate('riders').exec(function(err,ride){
        if (err) return res.status(500).send({ msg: err.message });
        console.log("found ride");
        var riders = ride.riders;
        User.findOne({_id: req.query.uid},function(err,user){
            if (err) { return res.status(500).send({ msg: err.message }); }
            if (!user) return res.status(400).send({ msg: 'We were unable to find a user.' });
            if (!user.verified) return res.status(400).send({ type: 'Not-verified', msg: 'This user is not verified.' });
            for(var i = 0; i < riders.length; i++) {
                if (riders[i]._id == req.query.uid) {
                    return res.status(200).json({error_code:0,ridestatus:'ALREADY_CONFIRMED'});
                }
            }
            riders.push(user)
            ride.riders = riders;
            ride.capacityLeft = ride.capacityLeft-req.query.seats;
            ride.save(function(err){
                if (err)  { return res.status(500).send({ msg: err.message }); }
                const mailOptions_self = { from: process.env.SENDGRID_EMAIL, to: user.email, subject: 'Your ride request has been accepted',
                                  text: "Hi,\n\n Your Ride with "+ ride.host.first_name +" from " + ride.originCity + " to " + ride.destinationCity + " on " + ride.departDate + " has been confirmed." };
                console.log(mailOptions_self);
                transporter.sendMail(mailOptions_self, function (err) {
                        if (err) { console.log(err);return res.status(500).send({ msg: err.message }); }
                        console.log("Mail sent");
                        // return res.status(200).json({rideStatus:'COMFIRMED', ride: ride });
                        return res.status(200).send("Ride confirmed");
                });
            });
        });
    });
}

exports.rideRejected = function(req,res,next){
    console.log(req.query.uid);
    console.log(req.query.rid);
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) return res.status(422).jsonp(errors.array());
    console.log(req.query.uid);
    console.log(req.query.rid);
    Ride.findOne({_id : req.query.rid}).populate('host').populate('riders').exec(function(err,ride){
        if (err) return res.status(500).send({ msg: err.message });
        console.log("found ride");
        var riders = ride.riders;
        User.findOne({_id: req.query.uid},function(err,user){
            if (err) { return res.status(500).send({ msg: err.message }); }
            if (!user) return res.status(400).send({ msg: 'We were unable to find a user.' });
            if (!user.verified) return res.status(400).send({ type: 'Not-verified', msg: 'This user is not verified.' });
            for(var i = 0; i < riders.length; i++) {
                if (riders[i]._id == req.query.uid) {
                    found = true;
                    return res.status(200).json({error_code:0, ridestatus:'ALREADY_CONFIRMED'});
                }
            }
            const mailOptions_self = { from: process.env.SENDGRID_EMAIL, to: user.email, subject: 'Your ride request has been accepted',
                              text: "Hi,\n\n Your Ride with "+ ride.host.first_name +" from " + ride.originCity + " to " + ride.destinationCity + " on " + ride.departDate + " has been rejected by the host. Please choose another ride." };
            console.log(mailOptions_self);
            transporter.sendMail(mailOptions_self, function (err) {
                    if (err) { console.log(err);return res.status(500).send({ msg: err.message }); }
                    console.log("Mail sent");
                    return res.status(200).send("Ride rejected");
                    // return res.status(200).json({rideStatus:'REJECTED', ride: ride });
            });

        });
    });
}

  exports.searchRideExhaustive = function(req, res, next) {
    // Check for validation error
    console.log("Reached!!!!!")
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) return res.status(422).jsonp(errors.array());
    console.log('Input:', req.body);
    //dates for query
    // if selectedDepartTime is present means departDate is actually return Date in CST
    var departDate_start = moment(req.body.departDate, "MM/DD/YYYY").tz(req.body.timeZone);
    var departDate_end = departDate_start.clone().add(1, 'day');
    if (req.body.selectedDepartTime != null) {
      var utcDepartTime = moment(req.body.selectedDepartTime);
      var localDepartTime = utcDepartTime.clone().tz(req.body.timeZone);
      // Only if Return and selected depart are on same date -> add the departure date offset
      if (departDate_start.diff(localDepartTime, "days") == 0) {
        departDate_start.set({
          'hour' : localDepartTime.get('hour'),
          'minute' : localDepartTime.get('minute')
        });
      }
    }

    //moment(departDate_start.getTime()+(1*24*60*60*1000))
    console.log(new Date(departDate_start.format()));
    console.log(new Date(departDate_end.format()));

    var originLocation = req.body.originCity;
    var destinationLocation = req.body.destinationCity;
    //get co-ordniates
    axios.all([
      axios.get('https://nominatim.openstreetmap.org/search?format=json',
    {
      params: {
        q : originLocation
      }
    }),
     axios.get('https://nominatim.openstreetmap.org/search?format=json',
    {
      params: {
        q : destinationLocation
      }
    })
    ])
    .then((resArr)=> {
      var initialCoords = ([parseFloat(resArr[0].data[0].lon), parseFloat(resArr[0].data[0].lat)]);
      var finalCoords = ([parseFloat(resArr[1].data[0].lon), parseFloat(resArr[1].data[0].lat)]);

      Ride.find(
          { departDate:{"$gte": (new Date(departDate_start.format())), // Date converts local to UTC which is better for $lt and $gt
                        "$lt": (new Date (departDate_end.format()))
                      },
            capacityLeft : {"$gte" : req.body.seats},
            initialCoords: {$near:
                                {$maxDistance: MAX_DISTANCE,
                                 $geometry: {type:"Point", coordinates:initialCoords}
                                }
                            },
            finalCoords: {$geoWithin:
                                {$centerSphere : [ finalCoords, 5 / 3963.2 ]} // The radius should be in radians so dividing by earth's radius
                            },
            //host: {$ne:req.body.uid}
          },  'host departDate originCity destinationCity maxCapacity occupiedCapacity pricePerSeat'
        ).populate('host', {first_name : 1, avatar : 1}).exec(function(err, departure_rides) {
          console.log("Got from DB")
          if (err) {
            console.log(err.message);
            return res.status(500).send({ msg: err.message })
          };
          console.log(departure_rides);
          // departure_rides = departure_rides.map(function (doc) {
          //   doc.departDate = moment(doc.departDate).tz(req.body.timeZone).format()
          // })
          // console.log(departure_rides);
          const result_d = JSON.stringify(departure_rides);
          console.log("result_d");
          console.log(result_d);
          const res_json = JSON.parse(result_d)
          console.log(res_json);
          for (i=0; i < res_json.length; i++) {
            res_json[i].departDate =  moment(res_json[i].departDate).tz(req.body.timeZone).format()
          }
          console.log(res_json)
          if (req.body.roundTrip) {
            //dates for query
            var returnDate_start = moment(req.body.returnDate, "MM/DD/YYYY").tz(req.body.timeZone);
            var returnDate_end =  returnDate_start.clone().add(1, 'day');
            Ride.find(
              { departDate:{"$gte": (new Date(returnDate_start.format())),
                            "$lt": (new Date(returnDate_end.format()))
                            },
                initialCoords: {$near:
                                    {$maxDistance: MAX_DISTANCE,
                                     $geometry: {type:"Point", coordinates:finalCoords}
                                    }
                                },
                finalCoords: {$geoWithin:
                                    {$centerSphere : [ initialCoords, 5 / 3963.2 ]} // The radius should be in radians so dividing by earth's radius
                                },
                //host: {$ne:req.body.uid}
              }, 'host departDate originCity destinationCity maxCapacity occupiedCapacity pricePerSeat'
            ).populate('host', {first_name : 1, avatar: 1}).exec(function(err, return_rides){
              if (err) return res.status(500).send({ msg: err.message });
              const result_r = JSON.stringify(return_rides);
              const resR_json = JSON.parse(result_r)
              console.log(resR_json);
              for (i=0; i < resR_json.length; i++) {
                resR_json[i].departDate =  moment(resR_json[i].departDate).tz(req.body.timeZone).format()
              }
              console.log(resR_json)
              console.log(resR_json, res_json)
              res.send({ error_code: 0, departure_rides:  JSON.stringify(res_json),
                     return_rides:  JSON.stringify(resR_json) });
              });
          }
          else{
            res.send({ error_code: 0, departure_rides: JSON.stringify(res_json),
                     return_rides: null });
          }
        });
      }). catch ((err) => {
        console.log("Search: Error while fetching GeoSpatial Info")
        return res.status(500).send({ msg: err.message })
      });
  };
