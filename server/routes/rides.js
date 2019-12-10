const express = require('express');
const router = express.Router();
const {checkIf, check, validationResult} = require('express-validator');

const rideController = require('../controllers/rideController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.session);
  res.send('Rides Home');
});

router.post('/createRide',
  [
     check('uid', 'Please log in to post rides').not().isEmpty(),
     check('roundTrip', 'Invalid trip type').isBoolean().not().isEmpty(),
     check('departDate', 'Invalid departure date').not().isEmpty().not().isAfter('returnDate'),
     check('departTime', 'Invalid Time').not().isEmpty(),
     check('maxCapacity', 'Invalid vehicle capacity').not().isEmpty().isNumeric(),
     check('occupiedCapacity', 'Invalid occupied capacity').not().isEmpty().isNumeric(),
     check('pricePerSeat', 'Invalid price per seat').not().isEmpty().isCurrency(),
     check('originCity', 'Invalid Origin city').not().isEmpty(),
     check('destinationCity', 'Invalid Destination city').not().isEmpty(),
     check('returnDate', 'Invalid return date').optional().not().isEmpty().not().isAfter('departDate'),
     check('returnTime', 'Invalid Time').optional().not().isEmpty(),
     check('timeZone', 'Time Zone should not be Empty').not().isEmpty()
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
  [ check('uid', 'Please login to search for rides').not().isEmpty(),
    check('roundTrip', 'Invalid trip type').optional().not().isEmpty().isBoolean(),
    check('departDate', 'Invalid departure date').not().isEmpty(),
    check('returnDate', 'Invalid return date').optional().not().isEmpty(),
    check('originCity', 'Invalid Origin city').not().isEmpty(),
    check('destinationCity', 'Invalid Destination city').not().isEmpty(),
    check('timeZone', 'Time Zone should not be Empty').not().isEmpty()
  ], rideController.searchRideExhaustive);

  router.post('/searchRideNew',
  [ check('uid', 'Please login to search for rides').not().isEmpty(),
    check('roundTrip', 'Invalid trip type').optional().not().isEmpty().isBoolean(),
    check('departDate', 'Invalid departure date').not().isEmpty(),
    check('returnDate', 'Invalid return date').optional().not().isEmpty(),
    check('originCity', 'Invalid Origin city').not().isEmpty(),
    check('destinationCity', 'Invalid Destination city').not().isEmpty(),
    check('timeZone', 'Time Zone should not be Empty').not().isEmpty()
  ], rideController.searchRideExhaustive);

  router.post('/rideHistory',
  [
    //check('roundTrip', 'Invalid trip type').not().isEmpty().isBoolean(),
    //check('departDate', 'Invalid departure date').not().isEmpty().not().isAfter('returnDate'),
    //check('returnDate', 'Invalid return date').not().isEmpty().isAfter('departDate'),
    //check('originCity', 'Invalid Origin city').not().isEmpty().isAlpha(),
    //check('destinationCity', 'Invalid Destination city').not().isEmpty().isAlpha(),
  ], rideController.rideHistory);

  router.post('/chooseride', [check('uid', 'Please log in to post rides').not().isEmpty(),
                              check('rid','Invalid ride object Id').not().isEmpty(),], rideController.chooseride);

  router.get('/updateRideConfirmed', [check('uid', 'Please log in to post rides').not().isEmpty(),
                              check('rid','Invalid ride object Id').not().isEmpty()],rideController.rideConfirmed);

  router.get('/updateRideRejected', [check('uid', 'Please log in to post rides').not().isEmpty(),
                              check('rid','Invalid ride object Id').not().isEmpty()],rideController.rideRejected);

module.exports = router;
