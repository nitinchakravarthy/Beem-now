const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');

const rideController = require('../controllers/rideController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.session);
  res.send('Rides Home');
});

router.post('/createRide',
  [
     check('roundTrip', 'Invalid trip type').not().isEmpty().isBoolean(),
     check('departDate', 'Invalid departure date').not().isEmpty().not().isAfter('returnDate'),
     //check('returnDate', 'Invalid return date').not().isEmpty().isAfter('departDate'),
     check('maxCapacity', 'Invalid vehicle capacity').not().isEmpty().isNumeric(),
     check('occupiedCapacity', 'Invalid occupied capacity').not().isEmpty().isNumeric(),
     check('pricePerSeat', 'Invalid price per seat').not().isEmpty().isCurrency(),
     check('originCity', 'Invalid Origin city').not().isEmpty().isAlpha(),
     check('destinationCity', 'Invalid Destination city').not().isEmpty().isAlpha(),
    //check('initialAddress', 'Invalid starting address').not().isEmpty(),
    //check('finalAddress', 'Invalid final address').not().isEmpty()
  ], rideController.createRide);


  // Get DRIVER ride info (specific ride)
  router.get('/driverRideInfo',
    [
      check('uid', 'UID invalid').not().isEmpty(),
      check('rid', 'RID invalid').not().isEmpty()
    ], rideController.getDriverRideInfo);


// Get PASSENGER 'user' ride info ()
router.get('/userRideInfo',
  [
    check('uid', 'UID invalid').not().isEmpty(),
    check('rid', 'RID invalid').not().isEmpty()
  ], rideController.getUserRideInfo);

  // Get Initial Coordinates of ride (for map posting?)
  router.get('/initialCoords',
    [
      check('uid', 'UID invalid').not().isEmpty(),
      check('rid', 'RID invalid').not().isEmpty()
    ], rideController.getInitialCoords);

  // Get Final coordinates of ride (for map posting?)
  router.get('/finalCoords',
    [
      check('uid', 'UID invalid').not().isEmpty(),
      check('rid', 'RID invalid').not().isEmpty()
    ], rideController.getFinalCoords);


    // Returns all rides by a driver
  router.get('/driverRides',
  [
    check('uid', 'UID invalid').not().isEmpty()
  ], rideController.getDriverRides);


  // Returns all rides by a rider / passenger
  router.get('/userRides',
    [
      check('uid', 'UID invalid').not().isEmpty()
    ], rideController.getRiderRides);

  router.post('/searchRide',
  [
    //check('roundTrip', 'Invalid trip type').not().isEmpty().isBoolean(),
    //check('departDate', 'Invalid departure date').not().isEmpty().not().isAfter('returnDate'),
    //check('returnDate', 'Invalid return date').not().isEmpty().isAfter('departDate'),
    //check('originCity', 'Invalid Origin city').not().isEmpty().isAlpha(),
    //check('destinationCity', 'Invalid Destination city').not().isEmpty().isAlpha(),
  ], rideController.searchRide);

module.exports = router;
